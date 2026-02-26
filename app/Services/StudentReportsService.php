<?php

namespace App\Services;

use App\Enums\PaymentType;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\Cast\Double;

class StudentReportsService
{
    /**
     * Returns total number of students, total number of classrooms,
     * and the number of students grouped by student status.
     *
     * @return array
     */
    public function getStudentSummary(): array
    {
        $totalStudents = Student::count();
        $totalClassrooms = Classroom::count();

        $studentsByStatus = Student::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'total_students' => $totalStudents,
            'total_classrooms' => $totalClassrooms,
            'students_by_status' => $studentsByStatus,
        ];
    }

    public function getStudentsByClassrooms(
        ?string $academicYear = null,
        ?string $language = null,
        ?string $level = null,
        ?int    $grade = null,
        ?int    $classroom = null,
        ?float  $min = null,
        ?string $sorting = null,
        ?string $type = null,
        ?bool   $includePayments = false
    ): Collection
    {
        $query = $this->buildBaseStudentQuery($academicYear, $language, $level, $grade, $classroom, $sorting);

        if ($includePayments) {
            $query = $this->addPaymentCalculations($query, $academicYear, $min, $type);
        }

        return $query->get();
    }

    /**
     * Get students grouped by classrooms.
     *
     * @param string|null $academicYear
     * @param string|null $language
     * @param string|null $level
     * @param int|null $grade
     * @param int|null $classroom
     * @param float|null $min
     * @param string|null $sorting
     * @param string|null $type
     * @param int|null $per_chunk
     * @param bool|null $includePayments
     * @return Collection
     */
    public function getStudentsGroupedByClassrooms(
        ?string $academicYear = null,
        ?string $language = null,
        ?string $level = null,
        ?int    $grade = null,
        ?int    $classroom = null,
        ?float  $min = null,
        ?string $sorting = null,
        ?string $type = null,
        ?int    $per_chunk = 15,
        ?bool   $includePayments = false
    ): Collection
    {
        $students = $this->getStudentsByClassrooms(
            $academicYear,
            $language,
            $level,
            $grade,
            $classroom,
            $min,
            $sorting,
            $type,
            $includePayments
        );

        return $this->groupStudentsByClassroom($students, $per_chunk);
    }

    /**
     * Transform flat student data into grouped structure by classroom.
     *
     * @param Collection $students
     * @return Collection
     */
    private function groupStudentsByClassroom(Collection $students, int $perChunk = 15): Collection
    {

        return $students
            ->groupBy('classroom_id')
            ->map(function ($classroomStudents) use ($perChunk) {
                $firstStudent = $classroomStudents->first();

                return [
                    'classroom' => $firstStudent->classroom,
                    'students' => $classroomStudents->chunk($perChunk)->map(fn($chunk) => $chunk->values())->values(),
                ];
            })
            ->values();
    }

    /**
     * Build the base query for students with classroom filtering.
     *
     * @param string|null $academicYear
     * @param string|null $language
     * @param string|null $level
     * @param int|null $grade
     * @param int|null $classroom
     * @param string|null $sorting
     * @return Builder|EloquentBuilder
     */
    private function buildBaseStudentQuery(
        ?string $academicYear,
        ?string $language,
        ?string $level,
        ?int    $grade,
        ?int    $classroom,
        ?string $sorting
    ): Builder|EloquentBuilder
    {
        return Student::query()
            ->with([
                'guardians:id,phone_number',
                'classroom' => fn($q) => $q->select('id', 'name', 'level', 'language', 'academic_year', 'grade', 'max_capacity')->withCount('students')
            ])
            ->when($academicYear, fn($query) => $query->whereHas('classroom', fn($q) => $q->where('academic_year', $academicYear))
            )
            ->when($language, fn($query) => $query->whereHas('classroom', fn($q) => $q->where('language', $language))
            )
            ->when($level, fn($query) => $query->whereHas('classroom', fn($q) => $q->where('level', $level))
            )
            ->when($grade, fn($query) => $query->whereHas('classroom', fn($q) => $q->where('grade', $grade))
            )
            ->when($classroom, fn($query) => $query->where('classroom_id', $classroom)
            )
            ->when($sorting, fn($query) => $query->orderBy('gender', $sorting === 'maleFirst' ? 'asc' : 'desc')
            )
            ->select('id', 'name_in_arabic', 'reg_number', 'tuition_id', 'administrative_id', 'classroom_id');
    }

    /**
     * Add payment calculations to the query and filter by minimum amount due.
     *
     * @param Builder|EloquentBuilder $query
     * @param string|null $academicYear
     * @param string|null $type
     * @param float $min
     * @return Builder|EloquentBUilder
     */
    private function addPaymentCalculations(
        Builder|EloquentBuilder $query,
        ?string                 $academicYear,
        float                   $min,
        ?string                 $type = PaymentType::TUITION->value
    ): Builder|EloquentBuilder
    {

        $type = PaymentType::tryFrom($type);

        if (!$type) {
            abort(422, 'Invalid payment type');
        }


        match ($type) {

            PaymentType::TUITION =>
            $query->selectSub(function ($q) {
                $q->from('payment_values')
                    ->selectRaw('COALESCE(SUM(payment_values.value), 0) - (SELECT COALESCE(SUM(exemptions.value), 0) FROM exemptions WHERE exemptions.student_id = students.id AND exemptions.type = students.note)')
                    ->whereColumn('payment_values.id', 'students.tuition_id');
            }, 'total_sum')
            ->selectSub(function ($q) {
                $q->from('exemptions')
                    ->selectRaw('COALESCE(SUM(exemptions.value), 0)')
                    ->whereColumn('exemptions.student_id', 'students.id')
                    ->whereColumn('exemptions.type', 'students.note');
            }, 'exemption_amount'),

            PaymentType::ADMINISTRATIVE =>
            $query->withSum('administrative as total_sum', 'value'),

            PaymentType::ADDITIONAL =>
            $query->withSum('extra_dues as total_sum', 'value'),

            PaymentType::BOOK =>
            $query->selectSub(function ($q) use ($academicYear) {
                $q->from('book_purchases')
                    ->join('books', 'books.id', '=', 'book_purchases.book_id')
                    ->selectRaw('COALESCE(SUM(book_purchases.quantity * books.price),0)')
                    ->whereColumn('book_purchases.student_id', 'students.id')
                    ->when($academicYear, fn($b) => $b->where('books.academic_year', $academicYear)
                    );
            }, 'total_sum')
        ,

            PaymentType::UNIFORM =>
            $query->selectSub(function ($q) use ($academicYear) {
                $q->from('uniform_purchases')
                    ->join('uniforms', 'uniforms.id', '=', 'uniform_purchases.uniform_id')
                    ->selectRaw('COALESCE(SUM(uniform_purchases.quantity * uniforms.price),0)')
                    ->whereColumn('uniform_purchases.student_id', 'students.id')
                    ->when($academicYear, fn($b) => $b->where('uniforms.academic_year', $academicYear)
                    );
            }, 'total_sum'),
        };

        $query->withSum([
            'payments as paid_sum' => fn($q) => $q->where('type', $type->value)
        ], 'value');


        if ($min > 0) {
            $query->havingRaw('(COALESCE(total_sum,0) - COALESCE(paid_sum,0)) >= ?', [$min]);
        } else {
            $query->havingRaw(
                '(COALESCE(total_sum,0) - COALESCE(paid_sum,0)) >= 0'
            );
        }

        return $query;
    }


}
