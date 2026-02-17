<?php

namespace App\Services;

use App\Enums\PaymentType;
use App\Models\Classroom;
use App\Models\Student;
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
        ?string $type = null
    ): Collection
    {
        $query = $this->buildBaseStudentQuery($academicYear, $language, $level, $grade, $classroom, $sorting);

        if ($min !== null) {
            $query = $this->addPaymentCalculations($query, $academicYear, $level, $language, $type, $min);
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
        ?int    $per_chunk = 15
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
                    'students' => $classroomStudents->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'name_in_arabic' => $student->name_in_arabic,
                            'total_paid' => $student->total_paid ?? null,
                            'total_required' => $student->total_required ?? null,
                            'amount_due' => $student->amount_due ?? null,
                        ];
                    })->chunk($perChunk)->map(fn($chunk) => $chunk->values())->values(),
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
     * @return Builder
     */
    private function buildBaseStudentQuery(
        ?string $academicYear,
        ?string $language,
        ?string $level,
        ?int    $grade,
        ?int    $classroom,
        ?string $sorting
    ): Builder
    {
        return DB::table('students')
            ->leftJoin('classrooms', 'students.classroom_id', '=', 'classrooms.id')
            ->select(
                'students.id',
                'students.name_in_arabic',
                'classrooms.id as classroom_id',
                'classrooms.name as classroom_name',
                'classrooms.level',
                'classrooms.language',
                'classrooms.academic_year'
            )
            ->when($academicYear, fn(Builder $query) => $query->where("classrooms.academic_year", '=', $academicYear))
            ->when($language, fn(Builder $query) => $query->where("classrooms.language", '=', $language))
            ->when($level, fn(Builder $query) => $query->where("classrooms.level", '=', $level))
            ->when($grade, fn(Builder $query) => $query->where("classrooms.grade", '=', $grade))
            ->when($classroom, fn(Builder $query) => $query->where("classrooms.id", '=', $classroom))
            ->when($sorting, fn(Builder $query) => $query->orderBy('students.gender', $sorting === 'maleFirst' ? 'asc' : 'desc'));
    }

    /**
     * Add payment calculations to the query and filter by minimum amount due.
     *
     * @param Builder $query
     * @param string|null $academicYear
     * @param string|null $level
     * @param string|null $language
     * @param string|null $type
     * @param float $min
     * @return Builder
     */
    private function addPaymentCalculations(
        Builder $query,
        ?string $academicYear,
        ?string $level,
        ?string $language,
        ?string $type,
        float   $min
    ): Builder
    {
        $paymentsSub = DB::table('payments')
            ->select("student_id", DB::raw("sum(value) as total_paid"))
            ->when($type, fn(Builder $query) => $query->where("payments.type", '=', $type))
            ->groupBy("student_id");

        $valuesSub = DB::table('payment_values')
            ->select("level", "language", 'academic_year', DB::raw("sum(value) as total_required"))
            ->when($academicYear, fn(Builder $query) => $query->where("payment_values.academic_year", '=', $academicYear))
            ->when($type, fn(Builder $query) => $query->where("payment_values.type", '=', $type))
            ->when($level, fn(Builder $query) => $query->where("payment_values.level", '=', $level))
            ->when($language, fn(Builder $query) => $query->where("payment_values.language", '=', $language))
            ->groupBy("level", "language", "academic_year");

        return $query
            ->leftJoinSub($paymentsSub, 'payments_sum', function (JoinClause $join) {
                $join->on('payments_sum.student_id', '=', 'students.id');
            })
            ->leftJoinSub($valuesSub, 'values_sum', function (JoinClause $join) {
                $join->on('values_sum.level', '=', 'classrooms.level')
                    ->on('values_sum.language', '=', 'classrooms.language')
                    ->on('values_sum.academic_year', '=', 'classrooms.academic_year');
            })
            ->addSelect(
                'payments_sum.total_paid',
                'values_sum.total_required',
                DB::raw('(values_sum.total_required - COALESCE(payments_sum.total_paid, 0)) as amount_due')
            )
            ->having('amount_due', '>=', $min);
    }
}
