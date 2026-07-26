<?php

namespace App\Rules;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\GradeAge;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;

class AgeForGrade implements ValidationRule
{
    public function __construct(
        protected ?int $grade = null
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $grade = $this->grade ?? request()->input('grade');

        if (!$grade) {
            return;
        }

        $gradeAge = GradeAge::whereHas('grade', fn($q) => $q->where('grade', $grade))->first();

        if (!$gradeAge) {
            return;
        }

        $classroomId = request()->input('classroom_id');
        $academicYearName = null;
        if ($classroomId) {
            $classroom = Classroom::find($classroomId);
            $academicYearName = $classroom?->academic_year;
        }
        if (!$academicYearName) {
            $academicYearName = AcademicYear::activeCached()?->name;
        }

        $parts = explode('/', $academicYearName);
        $startYear = count($parts) === 2 ? min((int) $parts[0], (int) $parts[1]) : now()->year;
        $referenceDate = Carbon::create($startYear, 10, 1);

        $birthDate = Carbon::parse($value);

        if ($birthDate->copy()->addYears($gradeAge->min_years)->addMonths($gradeAge->min_months)->gt($referenceDate)) {
            $fail("يجب أن لا يقل عمر الطالب عن {$gradeAge->min_years} سنوات و {$gradeAge->min_months} شهور في 1 أكتوبر لهذا الصف");
        }

        if ($gradeAge->max_years && $birthDate->copy()->addYears($gradeAge->max_years)->addMonths($gradeAge->max_months ?? 0)->lt($referenceDate)) {
            $fail("يجب أن لا يزيد عمر الطالب عن {$gradeAge->max_years} سنوات و {$gradeAge->max_months} شهور في 1 أكتوبر لهذا الصف");
        }
    }
}
