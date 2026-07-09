<?php

namespace App\Services\Promotion;

use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\GradeSubject;
use App\Models\Student;
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
            $passed = $totalMarks >= $minMarks;
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

    public function preview(string $fromYear, int $grade, ?string $language): Collection
    {
        $year = AcademicYear::where('name', $fromYear)->firstOrFail();

        $query = Student::query()
            ->where('grade', $grade)
            ->where('withdrawn', false)
            ->where(function ($q) {
                $q->where('status', '!=', 'graduated')
                    ->orWhereNull('status');
            });

        if ($language) {
            $query->where('language', $language);
        }

        $students = $query->get();

        return $students->map(fn (Student $s) => $this->evaluateStudent($s, $year));
    }
}
