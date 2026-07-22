<?php

namespace App\Services;

use App\Models\Classroom;
use Carbon\Carbon;

class BehaviorRegisterService
{
    public function getData(
        string $academicYear,
        int $month,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroomId = null,
    ): array {
        $parts = explode('-', str_replace(' ', '', $academicYear));
        $startYear = (int) $parts[0];

        $year = $month >= 9 ? $startYear : $startYear + 1;

        $date = Carbon::create($year, $month, 1);
        $daysInMonth = $date->daysInMonth;

        $days = [];
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $dayDate = Carbon::create($year, $month, $day);
            $days[] = [
                'number' => $day,
                'name' => $dayDate->locale('ar')->dayName,
            ];
        }

        $classroomQuery = Classroom::with(['students' => function ($query) {
            $query->where(fn ($sq) => $sq->where('status', '!=', 'متخرج')->orWhereNull('status'))
                ->orderBy('name_in_arabic');
        }])
            ->where('academic_year', $academicYear)
            ->orderByRaw('CAST(grade AS UNSIGNED)')
            ->orderBy('class_number');

        if ($language) {
            $classroomQuery->where('language', $language);
        }
        if ($level) {
            $classroomQuery->where('level', $level);
        }
        if ($grade) {
            $classroomQuery->where('grade', $grade);
        }
        if ($classroomId) {
            $classroomQuery->where('id', $classroomId);
        }

        $classrooms = $classroomQuery->get();

        return [
            'days' => $days,
            'classrooms' => $classrooms,
            'month' => $month,
            'monthName' => $date->locale('ar')->translatedFormat('F'),
            'year' => $year,
        ];
    }
}
