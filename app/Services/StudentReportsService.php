<?php

namespace App\Services;

use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

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
}
