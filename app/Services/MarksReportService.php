<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\PromotionBatchStudent;
use App\Models\Student;
use App\Models\StudentSeatAssignment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MarksReportService
{
    public function getClassReportData(string $academicYear, int $grade, string $language, string $semester, ?int $classroomId): array
    {
        $gradeSubjects = GradeSubject::with(['exams', 'subject'])
            ->whereHas('grade', fn ($q) => $q->where('grade', $grade))
            ->where('language', $language)
            ->when($semester !== 'both', fn ($q) => $q->where('semester', $semester))
            ->get();

        if ($gradeSubjects->isEmpty()) {
            return $this->emptyResponse($academicYear, $grade, $language, $semester);
        }

        $subjectList = $gradeSubjects->map(fn ($gs) => [
            'id' => $gs->id,
            'name' => $gs->subject?->name,
            'max' => (float) $gs->total_marks,
        ])->values();

        $gsIds = $gradeSubjects->pluck('id');

        $students = Student::where('grade', $grade)
            ->where('language', $language)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(fn ($q) => $q->where('status', '!=', 'graduated')->orWhereNull('status'))
            ->when($classroomId, fn ($q) => $q->where('classroom_id', $classroomId))
            ->get();

        if ($students->isEmpty()) {
            return $this->emptyResponse($academicYear, $grade, $language, $semester);
        }

        $studentIds = $students->pluck('id');

        $firstRound = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->whereIn('marks.student_id', $studentIds)
            ->whereIn('exams.grade_subject_id', $gsIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'first')
            ->select('marks.student_id', 'exams.grade_subject_id', DB::raw('COALESCE(SUM(marks.marks), 0) as total'))
            ->groupBy('marks.student_id', 'exams.grade_subject_id')
            ->get();

        $secondRound = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->whereIn('marks.student_id', $studentIds)
            ->whereIn('exams.grade_subject_id', $gsIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'second')
            ->select('marks.student_id', 'exams.grade_subject_id')
            ->distinct()
            ->get()
            ->groupBy('student_id')
            ->map(fn ($group) => $group->pluck('grade_subject_id'));

        $passedSecondRound = PromotionBatchStudent::whereIn('student_id', $studentIds)
            ->where('decision', 'دور_ثاني')
            ->where('second_round_passed', true)
            ->whereHas('batch', fn ($q) => $q->where('from_academic_year', $academicYear))
            ->where('rolled_back', false)
            ->pluck('student_id')
            ->toArray();

        $firstRoundByStudent = $firstRound->groupBy('student_id')
            ->map(fn ($group) => $group->keyBy('grade_subject_id')->map(fn ($r) => (float) $r->total));

        $seatNumbers = StudentSeatAssignment::whereIn('student_id', $studentIds)
            ->where('academic_year', $academicYear)
            ->get()
            ->keyBy('student_id');

        $sorted = $students->sortBy(function (Student $s) use ($seatNumbers) {
            return $seatNumbers->get($s->id)?->assigned_number ?? PHP_INT_MAX;
        })->values();

        $studentRows = $sorted->map(function (Student $s) use ($subjectList, $firstRoundByStudent, $secondRound, $passedSecondRound, $gradeSubjects, $seatNumbers) {
            $studentMarks = $firstRoundByStudent->get($s->id, collect());
            $secondRoundGS = $secondRound->get($s->id, collect());
            $passedSecond = in_array($s->id, $passedSecondRound);

            $marks = $subjectList->map(function ($subj) use ($studentMarks, $secondRoundGS, $passedSecond, $gradeSubjects) {
                $firstTotalEntry = $studentMarks->get($subj['id']);
                $hasAnyMark = $firstTotalEntry !== null;
                $firstTotal = $hasAnyMark ? (float) $firstTotalEntry : 0;
                $gs = $gradeSubjects->firstWhere('id', $subj['id']);
                $minMarks = $gs?->min_marks ?? 0;
                $maxMarks = $subj['max'];

                $hasSecond = $secondRoundGS->contains($subj['id']);

                if (!$hasAnyMark && !$hasSecond) {
                    $display = '—';
                    $effective = null;
                } else {
                    $effective = $firstTotal;
                    if ($passedSecond && $hasSecond && $firstTotal < $minMarks) {
                        $effective = $minMarks;
                    }
                    $display = $effective;
                }

                $color = $this->markColor($maxMarks > 0 && $effective !== null ? ($effective / $maxMarks) * 100 : null);

                return [
                    'value' => $effective,
                    'display' => $display,
                    'color' => $color,
                ];
            });

            return [
                'id' => $s->id,
                'name' => $s->name_in_arabic,
                'seat_number' => $seatNumbers->get($s->id)?->assigned_number,
                'marks' => $marks,
            ];
        });

        return [
            'academic_year' => $academicYear,
            'grade_name' => Grade::where('grade', $grade)->value('name'),
            'grade' => $grade,
            'language' => $language,
            'semester' => $semester,
            'subjects' => $subjectList,
            'students' => $studentRows,
            'totals' => [
                'students_count' => $sorted->count(),
                'subjects_count' => $subjectList->count(),
            ],
        ];
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

    private function emptyResponse(string $academicYear, int $grade, string $language, string $semester): array
    {
        return [
            'academic_year' => $academicYear,
            'grade_name' => Grade::where('grade', $grade)->value('name'),
            'grade' => $grade,
            'language' => $language,
            'semester' => $semester,
            'subjects' => [],
            'students' => [],
            'totals' => [
                'students_count' => 0,
                'subjects_count' => 0,
            ],
        ];
    }
}
