<?php

namespace App\Services;

use App\Models\Classroom;
use Illuminate\Support\Collection;

class DemographicsService
{
    public function getDemographicsReport(
        ?string $academicYear = null,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroom = null,
    ): Collection {
        $classrooms = Classroom::with(['students' => function ($q) {
            $q->select('id', 'classroom_id', 'gender', 'religion');
        }])
            ->when($academicYear, fn ($q) => $q->where('academic_year', $academicYear))
            ->when($language, fn ($q) => $q->where('language', $language))
            ->when($level, fn ($q) => $q->where('level', $level))
            ->when($grade, fn ($q) => $q->where('grade', $grade))
            ->when($classroom, fn ($q) => $q->where('id', $classroom))
            ->orderBy('level')
            ->orderBy('grade')
            ->orderBy('class_number')
            ->get(['id', 'name', 'language', 'level', 'grade']);

        $levels = $classrooms->groupBy('level')->map(function ($levelClassrooms, $levelName) {
            $grades = $levelClassrooms->groupBy('grade')->sortKeys()->map(function ($gradeClassrooms, $gradeNumber) {
                $classroomsData = $gradeClassrooms->map(function ($classroom) {
                    $students = $classroom->students;

                    $maleCount = $students->where('gender', 'male')->count();
                    $femaleCount = $students->where('gender', 'female')->count();
                    $muslimCount = $students->where('religion', 'مسلم')->count();
                    $christianCount = $students->where('religion', 'مسيحي')->count();
                    $muslimMale = $students->where('religion', 'مسلم')->where('gender', 'male')->count();
                    $christianMale = $students->where('religion', 'مسيحي')->where('gender', 'male')->count();
                    $muslimFemale = $students->where('religion', 'مسلم')->where('gender', 'female')->count();
                    $christianFemale = $students->where('religion', 'مسيحي')->where('gender', 'female')->count();

                    return [
                        'name' => $classroom->name,
                        'language' => $classroom->language,
                        'total_count' => $maleCount + $femaleCount,
                        'male_count' => $maleCount,
                        'female_count' => $femaleCount,
                        'muslim_count' => $muslimCount,
                        'christian_count' => $christianCount,
                        'muslim_male_count' => $muslimMale,
                        'christian_male_count' => $christianMale,
                        'muslim_female_count' => $muslimFemale,
                        'christian_female_count' => $christianFemale,
                    ];
                })->values();

                $totals = [
                    'classrooms_count' => $classroomsData->count(),
                    'total_count' => $classroomsData->sum('total_count'),
                    'male_count' => $classroomsData->sum('male_count'),
                    'female_count' => $classroomsData->sum('female_count'),
                    'muslim_count' => $classroomsData->sum('muslim_count'),
                    'christian_count' => $classroomsData->sum('christian_count'),
                    'muslim_male_count' => $classroomsData->sum('muslim_male_count'),
                    'christian_male_count' => $classroomsData->sum('christian_male_count'),
                    'muslim_female_count' => $classroomsData->sum('muslim_female_count'),
                    'christian_female_count' => $classroomsData->sum('christian_female_count'),
                ];

                return [
                    'grade' => (int) $gradeNumber,
                    'classrooms' => $classroomsData,
                    'totals' => $totals,
                ];
            })->values();

            $levelTotals = [
                'classrooms_count' => $grades->sum(fn ($g) => $g['totals']['classrooms_count']),
                'total_count' => $grades->sum(fn ($g) => $g['totals']['total_count']),
                'male_count' => $grades->sum(fn ($g) => $g['totals']['male_count']),
                'female_count' => $grades->sum(fn ($g) => $g['totals']['female_count']),
                'muslim_count' => $grades->sum(fn ($g) => $g['totals']['muslim_count']),
                'christian_count' => $grades->sum(fn ($g) => $g['totals']['christian_count']),
                'muslim_male_count' => $grades->sum(fn ($g) => $g['totals']['muslim_male_count']),
                'christian_male_count' => $grades->sum(fn ($g) => $g['totals']['christian_male_count']),
                'muslim_female_count' => $grades->sum(fn ($g) => $g['totals']['muslim_female_count']),
                'christian_female_count' => $grades->sum(fn ($g) => $g['totals']['christian_female_count']),
            ];

            return [
                'level' => $levelName,
                'grades' => $grades,
                'totals' => $levelTotals,
            ];
        })->values();

        return $levels;
    }
}
