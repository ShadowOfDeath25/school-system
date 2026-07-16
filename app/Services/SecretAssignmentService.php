<?php

namespace App\Services;

use App\Models\SecretNumber;
use App\Models\Student;
use App\Models\StudentSecretAssignment;

class SecretAssignmentService
{
    public function assign(
        string $academicYear,
        ?string $semester = null,
        ?string $level = null,
        ?int $grade = null,
        ?string $language = null,
    ): array {
        $configs = SecretNumber::where('academic_year', $academicYear);

        if ($semester) {
            $configs->where('semester', $semester);
        }
        if ($level) {
            $configs->where('level', $level);
        }
        if ($grade !== null) {
            $configs->where('grade', (string) $grade);
        }
        if ($language) {
            $configs->where('language', $language);
        }

        $configs = $configs->get();

        $results = [
            'assigned' => [],
            'skipped' => 0,
            'errors' => [],
        ];

        foreach ($configs as $config) {
            $students = Student::query()
                ->where('level', $config->level)
                ->where('grade', (int) $config->grade)
                ->where('language', $config->language)
                ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
                ->whereNotNull('classroom_id')
                ->get();

            if ($students->isEmpty()) {
                continue;
            }

            $alreadyAssigned = StudentSecretAssignment::where('academic_year', $academicYear)
                ->where('semester', $config->semester)
                ->whereIn('student_id', $students->pluck('id'))
                ->pluck('student_id')
                ->toArray();

            $results['skipped'] += count($alreadyAssigned);

            $studentsToAssign = $students->reject(
                fn (Student $s) => in_array($s->id, $alreadyAssigned)
            );

            if ($studentsToAssign->isEmpty()) {
                continue;
            }

            $sortedIds = $studentsToAssign->sortBy('name_in_arabic', SORT_REGULAR, false)->pluck('id');

            $sortedStudents = Student::whereIn('id', $sortedIds)
                ->orderByRaw('name_in_arabic COLLATE utf8mb4_unicode_ci ASC')
                ->get(['id', 'name_in_arabic']);

            $maxAssigned = StudentSecretAssignment::where('academic_year', $academicYear)
                ->max('assigned_number');

            if ($maxAssigned !== null) {
                $currentNumber = $maxAssigned + 1;
                $availableSeats = $config->ends_at - $maxAssigned;
            } else {
                $currentNumber = $config->starts_at;
                $availableSeats = $config->ends_at - $config->starts_at + 1;
            }

            $needed = $sortedStudents->count();

            if ($needed > $availableSeats) {
                $results['errors'][] = [
                    'group' => "{$config->level}/G{$config->grade}/{$config->language}/{$config->semester}",
                    'message' => "تحتاج {$needed} مقاعد لكن المتاح {$availableSeats} فقط",
                ];

                continue;
            }

            $now = now();
            $assignments = [];

            foreach ($sortedStudents as $student) {
                $assignments[] = [
                    'student_id' => $student->id,
                    'secret_number_id' => $config->id,
                    'assigned_number' => $currentNumber,
                    'academic_year' => $academicYear,
                    'semester' => $config->semester,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $currentNumber++;
            }

            StudentSecretAssignment::insert($assignments);

            $results['assigned'][$config->id] = [
                'group' => "{$config->level}/G{$config->grade}/{$config->language}/{$config->semester}",
                'range' => "{$config->starts_at}-{$config->ends_at}",
                'count' => count($assignments),
            ];
        }

        return $results;
    }
}
