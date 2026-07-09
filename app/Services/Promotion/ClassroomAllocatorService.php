<?php

namespace App\Services\Promotion;

use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class ClassroomAllocatorService
{
    public function allocate(Student $student, int $targetGrade, string $academicYear): Classroom
    {
        $level = app(PromotionEligibilityService::class)->levelForGrade($targetGrade);
        $language = $student->language;

        return $this->findOrCreateClassroom($targetGrade, $language, $level, $academicYear);
    }

    public function findOrCreateClassroom(int $grade, string $language, string $level, string $academicYear): Classroom
    {
        $existing = Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->where('academic_year', $academicYear)
            ->withCount(['students' => function ($q) {
                $q->where('withdrawn', false)->orWhereNull('withdrawn');
            }])
            ->get()
            ->filter(fn (Classroom $c) => $c->max_capacity === 0 || $c->students_count < $c->max_capacity)
            ->sortBy('class_number');

        $classroom = $existing->first();

        if ($classroom) {
            return $classroom;
        }

        $maxClassNumber = Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->where('academic_year', $academicYear)
            ->max('class_number') ?? 0;

        $capacity = Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->value('max_capacity') ?? 30;

        return DB::transaction(function () use ($grade, $language, $level, $academicYear, $maxClassNumber, $capacity) {
            $classNumber = $maxClassNumber + 1;
            return Classroom::create([
                'grade' => $grade,
                'language' => $language,
                'level' => $level,
                'class_number' => $classNumber,
                'max_capacity' => $capacity,
                'actual_capacity' => $capacity,
                'academic_year' => $academicYear,
                'name' => $classNumber . '/' . getGradeNumber($grade) . ' ' . $level,
            ]);
        });
    }
}
