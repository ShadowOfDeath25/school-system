<?php

namespace App\Services\Promotion;

use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\GradeSubject;
use App\Models\Student;
use App\Models\StudentSecretAssignment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PromotionEligibilityService
{
    protected array $levelMap = [
        1 => 'رياض أطفال', 2 => 'رياض أطفال',
        3 => 'ابتدائي', 4 => 'ابتدائي', 5 => 'ابتدائي', 6 => 'ابتدائي', 7 => 'ابتدائي', 8 => 'ابتدائي',
        9 => 'اعدادي', 10 => 'اعدادي', 11 => 'اعدادي',
    ];

    public function levelForGrade(int $grade): string
    {
        return $this->levelMap[$grade] ?? 'ابتدائي';
    }

    public function evaluateStudent(Student $student, AcademicYear $fromYear): array
    {
        $subjects = $this->getStudentMarksBySubject($student, $fromYear, 'first');
        $gradeSubjects = GradeSubject::whereHas('grade', fn ($q) => $q->where('grade', $student->grade))
            ->where('language', $student->language)
            ->get();

        $details = [];

        foreach ($gradeSubjects as $gs) {
            $totalMarks = (float) ($subjects->firstWhere('grade_subject_id', $gs->id)?->total ?? 0);
            $minMarks = (float) $gs->min_marks;
            $achievableMax = $gs->total_marks;
            $effectiveMin = $achievableMax > 0 ? min($minMarks, $achievableMax) : $minMarks;
            $passed = $totalMarks >= $effectiveMin;
            $hasExams = Exam::where('grade_subject_id', $gs->id)
                ->where('academic_year', $fromYear->name)
                ->exists();

            $details[] = [
                'grade_subject_id' => $gs->id,
                'subject_name' => $gs->subject?->name,
                'total_marks' => $totalMarks,
                'min_marks' => $minMarks,
                'passed' => $hasExams ? $passed : true,
                'has_exams' => $hasExams,
            ];
        }

        $category = $this->determineCategory($student->grade, $details);

        return [
            'student' => $student,
            'subjects' => collect($details),
            'category' => $category,
            'details' => $details,
        ];
    }

    public function getStudentMarksBySubject(Student $student, AcademicYear $year, string $round = 'first'): Collection
    {
        return DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->join('grade_subject', 'exams.grade_subject_id', '=', 'grade_subject.id')
            ->where('marks.student_id', $student->id)
            ->where('marks.academic_year', $year->name)
            ->where('marks.round', $round)
            ->select(
                'grade_subject.id as grade_subject_id',
                DB::raw('SUM(marks.marks) as total'),
                'grade_subject.min_marks'
            )
            ->groupBy('grade_subject.id', 'grade_subject.min_marks')
            ->get();
    }

    public function isSubjectPassed(Student $student, GradeSubject $gradeSubject, AcademicYear $year, string $round = 'first'): bool
    {
        $marks = $this->getStudentMarksBySubject($student, $year, $round);
        $total = (float) ($marks->firstWhere('grade_subject_id', $gradeSubject->id)?->total ?? 0);
        return $total >= (float) $gradeSubject->min_marks;
    }

    public function determineCategory(int $grade, array $subjectResults): string
    {
        $failedCount = collect($subjectResults)->where('passed', false)->count();

        if ($grade === 11 && $failedCount === 0) {
            return 'graduated';
        }

        if ($failedCount === 0) {
            return 'passed';
        }

        if ($failedCount <= 2) {
            return 'دور_ثاني_eligible';
        }

        return 'repeat';
    }

    public function getStudentsWithMissingMarks(int $grade, string $language, string $fromYear): Collection
    {
        $year = AcademicYear::where('name', $fromYear)->firstOrFail();
        $now = $year->name;

        $gradeSubjectIds = GradeSubject::whereHas('grade', fn ($q) => $q->where('grade', $grade))
            ->where('language', $language)
            ->pluck('id');

        $expectedExamIds = Exam::whereIn('grade_subject_id', $gradeSubjectIds)
            ->where('academic_year', $now)
            ->pluck('id');

        if ($expectedExamIds->isEmpty()) {
            return collect();
        }

        $students = Student::query()
            ->where('grade', $grade)
            ->where('language', $language)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(fn ($q) => $q->where('status', '!=', 'متخرج')->orWhereNull('status'))
            ->get();

        $secretNumbers = StudentSecretAssignment::where('academic_year', $now)
            ->whereIn('student_id', $students->pluck('id'))
            ->get()
            ->groupBy('student_id')
            ->map(fn ($group) => $group->pluck('assigned_number')->unique()->implode('، '));

        $existingMarks = DB::table('marks')
            ->whereIn('student_id', $students->pluck('id'))
            ->where('academic_year', $now)
            ->where('round', 'first')
            ->whereIn('exam_id', $expectedExamIds)
            ->select('student_id', 'exam_id')
            ->distinct()
            ->get()
            ->groupBy('student_id');

        return $students->filter(function (Student $s) use ($expectedExamIds, $existingMarks) {
            $markedExamIds = $existingMarks->get($s->id)?->pluck('exam_id') ?? collect();
            return $expectedExamIds->diff($markedExamIds)->isNotEmpty();
        })->map(function (Student $s) use ($secretNumbers) {
            return [
                'id' => $s->id,
                'name' => $s->name_in_arabic,
                'assigned_number' => $secretNumbers->get($s->id, '—'),
            ];
        })->values();
    }

    public function preview(string $fromYear, int $grade, ?string $language): Collection
    {
        $year = AcademicYear::where('name', $fromYear)->firstOrFail();

        $query = Student::query()
            ->where('grade', $grade)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(function ($q) {
                $q->where('status', '!=', 'متخرج')
                    ->orWhereNull('status');
            });

        if ($language) {
            $query->where('language', $language);
        }

        $students = $query->get();

        return $students->map(fn (Student $s) => $this->evaluateStudent($s, $year));
    }
}
