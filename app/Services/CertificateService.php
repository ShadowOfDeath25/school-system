<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\PromotionBatch;
use App\Models\PromotionBatchStudent;
use App\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CertificateService
{
    public function getCertificatesData(array $filters): array
    {
        $semester = $filters['semester'] ?? 'both';

        if ($batchId = $filters['promotion_batch_id'] ?? null) {
            $batch = PromotionBatch::with('batchStudents')->findOrFail($batchId);
            $academicYear = $batch->from_academic_year;

            $studentRows = $batch->batchStudents
                ->filter(fn ($bs) => !$bs->rolled_back)
                ->map(fn ($batchStudent) => $this->getStudentCertificateDataFromBatch($batchStudent, $academicYear, $semester))
                ->filter()
                ->values();

            return ['students' => $studentRows->all()];
        }

        $academicYear = $filters['academic_year'];

        $query = Student::query()
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false));

        if ($studentId = $filters['student_id'] ?? null) {
            $query->where('id', $studentId);
        }
        if ($grade = $filters['grade'] ?? null) {
            $query->where('grade', $grade);
        }
        if ($language = $filters['language'] ?? null) {
            $query->where('language', $language);
        }
        if ($level = $filters['level'] ?? null) {
            $query->where('level', $level);
        }
        if ($classroomId = $filters['classroom_id'] ?? null) {
            $query->where('classroom_id', $classroomId);
        }

        $students = $query->get();

        if ($students->isEmpty()) {
            return ['students' => []];
        }

        $studentRows = $students->map(fn (Student $student) => $this->getStudentCertificateData($student, $academicYear, $semester))
            ->filter()
            ->values();

        return ['students' => $studentRows->all()];
    }

    public function getStudentCertificateData(Student $student, string $academicYear, string $semester = 'both'): ?array
    {
        $gradeSubjects = GradeSubject::with('subject')
            ->whereHas('grade', fn ($q) => $q->where('grade', $student->grade))
            ->where('language', $student->language)
            ->when($semester !== 'both', fn ($q) => $q->where('semester', $semester))
            ->get();

        if ($gradeSubjects->isEmpty()) {
            return null;
        }

        $gsIds = $gradeSubjects->pluck('id');

        $firstRoundMarks = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->where('marks.student_id', $student->id)
            ->whereIn('exams.grade_subject_id', $gsIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'first')
            ->select('exams.grade_subject_id', DB::raw('COALESCE(SUM(marks.marks), 0) as total'))
            ->groupBy('exams.grade_subject_id')
            ->get()
            ->keyBy('grade_subject_id')
            ->map(fn ($r) => (float) $r->total);

        $secondRoundGS = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->where('marks.student_id', $student->id)
            ->whereIn('exams.grade_subject_id', $gsIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'second')
            ->select('exams.grade_subject_id')
            ->distinct()
            ->get()
            ->pluck('grade_subject_id');

        $passedSecondRound = PromotionBatchStudent::where('student_id', $student->id)
            ->where('decision', 'دور_ثاني')
            ->where('second_round_passed', true)
            ->whereHas('batch', fn ($q) => $q->where('from_academic_year', $academicYear))
            ->where('rolled_back', false)
            ->exists();

        $subjects = $gradeSubjects->map(function (GradeSubject $gs) use ($firstRoundMarks, $secondRoundGS, $passedSecondRound) {
            $firstTotal = (float) ($firstRoundMarks->get($gs->id, 0));
            $hasAnyMark = $firstRoundMarks->has($gs->id);
            $hasSecond = $secondRoundGS->contains($gs->id);
            $maxMarks = (float) $gs->total_marks;
            $minMarks = (float) $gs->min_marks;

            if (!$hasAnyMark && !$hasSecond) {
                $effective = null;
                $passed = false;
            } else {
                $effective = $firstTotal;
                if ($passedSecondRound && $hasSecond && $firstTotal < $minMarks) {
                    $effective = $minMarks;
                }
                $minThreshold = $maxMarks > 0 ? min($minMarks, $maxMarks) : $minMarks;
                $passed = $effective >= $minThreshold;
            }

            $pct = ($maxMarks > 0 && $effective !== null) ? ($effective / $maxMarks) * 100 : null;
            $color = $this->markColor($pct);

            return [
                'name' => $gs->subject?->name,
                'max' => $maxMarks,
                'min' => $minMarks,
                'marks' => $effective,
                'color' => $color,
                'passed' => $passed,
                'added_to_total' => $gs->added_to_total,
            ];
        });

        $category = $this->determineCategory($student, $subjects, $academicYear);

        $totalMax = $subjects->where('added_to_total', true)->sum('max');
        $totalMin = $subjects->where('added_to_total', true)->sum('min');
        $totalMarks = $subjects->where('added_to_total', true)->sum(fn ($s) => (float) ($s['marks'] ?? 0));

        return [
            'id' => $student->id,
            'name' => $student->name_in_arabic,
            'grade' => $student->grade,
            'grade_name' => Grade::where('grade', $student->grade)->value('name'),
            'language' => $student->language,
            'subjects' => $subjects->values()->all(),
            'total_max' => $totalMax,
            'total_min' => $totalMin,
            'total_marks' => $totalMarks,
            'category' => $category,
            'category_text' => $this->getCategoryText($category, $student->grade),
        ];
    }

    public function getStudentCertificateDataFromBatch(PromotionBatchStudent $batchStudent, string $academicYear, string $semester): ?array
    {
        $student = Student::find($batchStudent->student_id);
        if (!$student) return null;

        $data = $this->getStudentCertificateData($student, $academicYear, $semester);
        if (!$data) return null;

        $fromGrade = (int) $batchStudent->from_grade;
        $category = $this->mapBatchDecision($batchStudent);

        $data['grade'] = $fromGrade;
        $data['grade_name'] = Grade::where('grade', $fromGrade)->value('name');
        $data['category'] = $category;
        $data['category_text'] = $this->getCategoryText($category, $fromGrade);

        return $data;
    }

    private function mapBatchDecision(PromotionBatchStudent $batchStudent): string
    {
        return match ($batchStudent->decision) {
            'promoted' => 'passed',
            'graduated' => 'graduated',
            'repeated' => 'repeat',
            'دور_ثاني' => match ($batchStudent->second_round_passed) {
                true => 'second_round_passed',
                false => 'second_round_failed',
                default => 'دور_ثاني_eligible',
            },
            default => 'repeat',
        };
    }

    private function markColor(?float $pct): string
    {
        if ($pct === null) return '#7f8c8d';
        return match (true) {
            $pct >= 85 => '#3498db',
            $pct >= 65 => '#2ecc71',
            $pct >= 50 => '#f39c12',
            default    => '#e74c3c',
        };
    }

    private function determineCategory(Student $student, Collection $subjects, string $academicYear): string
    {
        $batchRecord = PromotionBatchStudent::where('student_id', $student->id)
            ->whereHas('batch', fn ($q) => $q->where('from_academic_year', $academicYear))
            ->where('rolled_back', false)
            ->first();

        if ($batchRecord) {
            if ($batchRecord->decision === 'promoted') return 'passed';
            if ($batchRecord->decision === 'graduated') return 'graduated';
            if ($batchRecord->decision === 'repeated') return 'repeat';
            if ($batchRecord->decision === 'دور_ثاني') {
                if ($batchRecord->second_round_passed === true) return 'second_round_passed';
                if ($batchRecord->second_round_passed === false) return 'second_round_failed';
                return 'دور_ثاني_eligible';
            }
        }

        $failedCount = $subjects->where('passed', false)->count();

        if ($student->grade === 11 && $failedCount === 0) return 'graduated';
        if ($failedCount === 0) return 'passed';
        if ($failedCount <= 2) return 'دور_ثاني_eligible';
        return 'repeat';
    }

    private function getCategoryText(string $category, int $grade): string
    {
        $nextGradeName = Grade::where('grade', $grade + 1)->value('name');

        return match ($category) {
            'passed' => "ناجح و منقول للصف {$nextGradeName}",
            'graduated' => 'متخرج - ألف مبروك',
            'repeat' => 'يعيد السنة الدراسية',
            'دور_ثاني_eligible' => 'مؤهل لدور ثاني',
            'second_round_passed' => "نجاح دور ثاني - منقول للصف {$nextGradeName}",
            'second_round_failed' => 'رسوب دور ثاني - يعيد السنة الدراسية',
            default => '',
        };
    }
}
