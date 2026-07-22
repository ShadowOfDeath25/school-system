<?php

namespace App\Services;

use App\Models\Classroom;
use Illuminate\Support\Collection;

class StudentStatsService
{
    public function getStudentStats(
        ?string $academicYear = null,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroom = null,
        ?string $noteFilter = null,
    ): Collection {
        $classrooms = Classroom::with(['students' => function ($q) use ($noteFilter) {
            $q->select('id', 'classroom_id', 'gender', 'religion', 'status');
            if ($noteFilter) {
                if ($noteFilter === 'لا يوجد') {
                    $q->where(function ($q2) {
                        $q2->whereNull('note')->orWhere('note', '');
                    });
                } else {
                    $q->where('note', $noteFilter);
                }
            }
        }])
            ->when($academicYear, fn ($q) => $q->where('academic_year', $academicYear))
            ->when($language, fn ($q) => $q->where('language', $language))
            ->when($level, fn ($q) => $q->where('level', $level))
            ->when($grade, fn ($q) => $q->where('grade', $grade))
            ->when($classroom, fn ($q) => $q->where('id', $classroom))
            ->orderBy('class_number')
            ->get(['id', 'name', 'language', 'level', 'grade', 'max_capacity', 'actual_capacity']);

        return $classrooms->map(function ($classroom) {
            $students = $classroom->students;

            $maleCount = $students->where('gender', 'male')->count();
            $femaleCount = $students->where('gender', 'female')->count();
            $maleMuslim = $students->where('gender', 'male')->where('religion', 'مسلم')->count();
            $maleChristian = $students->where('gender', 'male')->where('religion', 'مسيحي')->count();
            $femaleMuslim = $students->where('gender', 'female')->where('religion', 'مسلم')->count();
            $femaleChristian = $students->where('gender', 'female')->where('religion', 'مسيحي')->count();
            $remainingCount = $students->where('status', 'باقي')->count();

            return [
                'classroom_name' => $classroom->name,
                'grade' => $classroom->grade,
                'total_count' => $maleCount + $femaleCount,
                'male_count' => $maleCount,
                'male_muslim' => $maleMuslim,
                'male_christian' => $maleChristian,
                'female_count' => $femaleCount,
                'female_muslim' => $femaleMuslim,
                'female_christian' => $femaleChristian,
                'remaining_count' => $remainingCount,
            ];
        })->values();
    }
}
