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
                    'classroom_id' => $firstStudent->classroom_id,
                    'classroom_name' => $firstStudent->classroom_name,
                    'level' => $firstStudent->level,
                    'language' => $firstStudent->language,
                    'academic_year' => $firstStudent->academic_year,
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
            ->with('guardians:id,phone_number')
            ->leftJoin('classrooms', 'students.classroom_id', '=', 'classrooms.id')
            ->select(
                'students.id',
                'students.name_in_arabic',
                'students.tuition_id',
                'students.administrative_id',
                'classrooms.id as classroom_id',
                'classrooms.name as classroom_name',
                'classrooms.level',
                'classrooms.language',
                'classrooms.academic_year',
            )
            ->when($academicYear, fn(EloquentBuilder $query) => $query->where("classrooms.academic_year", '=', $academicYear))
            ->when($language, fn(EloquentBuilder $query) => $query->where("classrooms.language", '=', $language))
            ->when($level, fn(EloquentBuilder $query) => $query->where("classrooms.level", '=', $level))
            ->when($grade, fn(EloquentBuilder $query) => $query->where("classrooms.grade", '=', $grade))
            ->when($classroom, fn(EloquentBuilder $query) => $query->where("classrooms.id", '=', $classroom))
            ->when($sorting, fn(EloquentBuilder $query) => $query->orderBy('students.gender', $sorting === 'maleFirst' ? 'asc' : 'desc'));
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
            $query->withSum('tuition as total_sum', 'value'),

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
