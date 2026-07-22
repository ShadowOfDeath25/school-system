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
    public function getClassReportData(string $academicYear, int $grade, string $language, string $semester, ?int $classroomId, bool $detailed = false): array
    {
        $gradeSubjects = GradeSubject::with(['exams', 'subject'])
            ->whereHas('grade', fn ($q) => $q->where('grade', $grade))
            ->where('language', $language)
            ->when($semester !== 'both', fn ($q) => $q->where('semester', $semester))
            ->get();

        if ($gradeSubjects->isEmpty()) {
            return $this->emptyResponse($academicYear, $grade, $language, $semester, $detailed);
        }

        $subjectList = $gradeSubjects->map(function ($gs) use ($detailed) {
            $item = [
                'id' => $gs->id,
                'name' => $gs->subject?->name,
                'max' => (float) $gs->total_marks,
            ];
            if ($detailed) {
                $item['components'] = $gs->components ?? [['id' => null, 'name' => $gs->subject?->name, 'marks' => $gs->total_marks]];
            }
            return $item;
        })->values();

        $gsIds = $gradeSubjects->pluck('id');

        $students = Student::with('classroom')
            ->where('grade', $grade)
            ->where('language', $language)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(fn ($q) => $q->where('status', '!=', 'graduated')->orWhereNull('status'))
            ->when($classroomId, fn ($q) => $q->where('classroom_id', $classroomId))
            ->get();

        if ($students->isEmpty()) {
            return $this->emptyResponse($academicYear, $grade, $language, $semester, $detailed);
        }

        $studentIds = $students->pluck('id');

        $firstRoundQuery = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->whereIn('marks.student_id', $studentIds)
            ->whereIn('exams.grade_subject_id', $gsIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'first');

        if ($detailed) {
            $firstRound = (clone $firstRoundQuery)
                ->select('marks.student_id', 'exams.grade_subject_id', 'marks.component_id', DB::raw('COALESCE(SUM(marks.marks), 0) as total'))
                ->groupBy('marks.student_id', 'exams.grade_subject_id', 'marks.component_id')
                ->get();
        } else {
            $firstRound = $firstRoundQuery
                ->select('marks.student_id', 'exams.grade_subject_id', DB::raw('COALESCE(SUM(marks.marks), 0) as total'))
                ->groupBy('marks.student_id', 'exams.grade_subject_id')
                ->get();
        }

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

        if ($detailed) {
            $firstRoundByStudent = $firstRound->groupBy('student_id')
                ->map(fn ($group) => $group->groupBy('grade_subject_id')
                    ->map(fn ($byGS) => $byGS->keyBy('component_id')->map(fn ($r) => (float) $r->total)));
        } else {
            $firstRoundByStudent = $firstRound->groupBy('student_id')
                ->map(fn ($group) => $group->keyBy('grade_subject_id')->map(fn ($r) => (float) $r->total));
        }

        $seatNumbers = StudentSeatAssignment::whereIn('student_id', $studentIds)
            ->where('academic_year', $academicYear)
            ->get()
            ->keyBy('student_id');

        $sorted = $students->sortBy(function (Student $s) use ($seatNumbers) {
            return $seatNumbers->get($s->id)?->assigned_number ?? PHP_INT_MAX;
        })->values();

        $studentRows = $sorted->map(function (Student $s) use ($subjectList, $firstRoundByStudent, $secondRound, $passedSecondRound, $gradeSubjects, $seatNumbers, $detailed) {
            $studentMarks = $firstRoundByStudent->get($s->id, collect());
            $secondRoundGS = $secondRound->get($s->id, collect());
            $passedSecond = in_array($s->id, $passedSecondRound);

            if (!$detailed) {
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
            } else {
                $marks = collect();
                foreach ($subjectList as $subj) {
                    $gs = $gradeSubjects->firstWhere('id', $subj['id']);
                    $minMarks = $gs?->min_marks ?? 0;
                    $maxMarks = $subj['max'];
                    $components = $subj['components'] ?? [];

                    $subjectMarks = $studentMarks->get($subj['id'], collect());
                    $hasSecond = $secondRoundGS->contains($subj['id']);
                    $hasAnyMark = $subjectMarks->isNotEmpty() || $hasSecond;

                    if (!$hasAnyMark) {
                        foreach ($components as $comp) {
                            $marks->push([
                                'value' => null,
                                'display' => '—',
                                'color' => '#7f8c8d',
                                'component_id' => $comp['id'] ?? null,
                                'component_name' => $comp['name'] ?? $subj['name'],
                                'component_max' => (float) ($comp['marks'] ?? 0),
                            ]);
                        }
                        continue;
                    }

                    $rawTotal = 0;
                    $rawComponents = [];
                    foreach ($components as $comp) {
                        $compRaw = (float) ($subjectMarks->get($comp['id']) ?? 0);
                        $rawComponents[] = [
                            'value' => $compRaw,
                            'component_id' => $comp['id'] ?? null,
                            'component_name' => $comp['name'] ?? $subj['name'],
                            'component_max' => (float) ($comp['marks'] ?? 0),
                        ];
                        $rawTotal += $compRaw;
                    }

                    $effectiveTotal = $rawTotal;
                    if ($passedSecond && $hasSecond && $rawTotal < $minMarks) {
                        $effectiveTotal = $minMarks;
                    }

                    $color = $this->markColor($maxMarks > 0 ? ($effectiveTotal / $maxMarks) * 100 : null);
                    $bump = $effectiveTotal - $rawTotal;

                    foreach ($rawComponents as $comp) {
                        $compValue = $comp['value'];
                        if ($bump > 0 && $maxMarks > 0) {
                            $compValue += ($comp['component_max'] / $maxMarks) * $bump;
                        }
                        $marks->push([
                            'value' => $compValue,
                            'display' => is_float($compValue) || is_int($compValue) ? round($compValue, 1) : $compValue,
                            'color' => $color,
                            'component_id' => $comp['component_id'],
                            'component_name' => $comp['component_name'],
                            'component_max' => $comp['component_max'],
                        ]);
                    }
                }
            }

            return [
                'id' => $s->id,
                'name' => $s->name_in_arabic,
                'seat_number' => $seatNumbers->get($s->id)?->assigned_number,
                'classroom_name' => $s->classroom?->name,
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
                'columns_count' => $detailed
                    ? collect($subjectList)->sum(fn ($s) => count($s['components'])) + 3
                    : count($subjectList) + 2,
            ],
        ];
    }

    public function getTopStudentsData(
        string $academicYear,
        string $language,
        string $semester,
        string $level,
        ?int $grade = null,
    ): array {
        $gradeMap = [
            'رياض أطفال' => [1, 2],
            'ابتدائي' => [3, 4, 5, 6, 7, 8],
            'اعدادي' => [9, 10, 11],
        ];

        $gradesInLevel = $gradeMap[$level] ?? [];
        if (empty($gradesInLevel)) {
            return $this->emptyTopResponse($academicYear, $language, $semester, $level);
        }

        if ($grade !== null) {
            $gradesInLevel = in_array($grade, $gradesInLevel) ? [$grade] : [];
        }

        if (empty($gradesInLevel)) {
            return $this->emptyTopResponse($academicYear, $language, $semester, $level);
        }

        $semesterFilter = $semester !== 'both';

        $gradeModels = Grade::whereIn('grade', $gradesInLevel)->get()->keyBy('grade');
        $gradeIds = $gradeModels->pluck('id');

        $gradeSubjects = GradeSubject::with(['subject', 'grade'])
            ->whereIn('grade_id', $gradeIds)
            ->where('language', $language)
            ->where('added_to_total', true)
            ->when($semesterFilter, fn ($q) => $q->where('semester', $semester))
            ->get();

        if ($gradeSubjects->isEmpty()) {
            return $this->emptyTopResponse($academicYear, $language, $semester, $level);
        }

        $subjectsByGrade = $gradeSubjects->groupBy(fn ($gs) => $gs->grade->grade);
        $allGSIds = $gradeSubjects->pluck('id');
        $maxScoreByGrade = $subjectsByGrade->map(fn ($group) => (float) $group->sum('total_marks'));

        $students = Student::with('classroom')
            ->whereIn('grade', $gradesInLevel)
            ->where('language', $language)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(fn ($q) => $q->where('status', '!=', 'graduated')->orWhereNull('status'))
            ->get();

        if ($students->isEmpty()) {
            return $this->emptyTopResponse($academicYear, $language, $semester, $level);
        }

        $studentIds = $students->pluck('id');

        $marksByStudent = DB::table('marks')
            ->join('exams', 'marks.exam_id', '=', 'exams.id')
            ->whereIn('marks.student_id', $studentIds)
            ->whereIn('exams.grade_subject_id', $allGSIds)
            ->where('marks.academic_year', $academicYear)
            ->where('marks.round', 'first')
            ->select('marks.student_id', DB::raw('COALESCE(SUM(marks.marks), 0) as total'))
            ->groupBy('marks.student_id')
            ->get()
            ->keyBy('student_id')
            ->map(fn ($r) => (float) $r->total);

        $seatNumbers = StudentSeatAssignment::whereIn('student_id', $studentIds)
            ->where('academic_year', $academicYear)
            ->get()
            ->keyBy('student_id');

        $studentsByGrade = $students->groupBy('grade');

        $gradesData = [];
        foreach ($gradesInLevel as $g) {
            $gradeStudents = $studentsByGrade->get($g, collect());
            $maxScore = $maxScoreByGrade->get($g, 0);

            if ($gradeStudents->isEmpty() || $maxScore <= 0) {
                continue;
            }

            $gradeStudentEntries = $gradeStudents->map(function (Student $s) use ($marksByStudent, $seatNumbers) {
                return [
                    'name' => $s->name_in_arabic,
                    'seat_number' => $seatNumbers->get($s->id)?->assigned_number,
                    'classroom_name' => $s->classroom?->name,
                    'total_score' => $marksByStudent->get($s->id, 0),
                ];
            })->sortByDesc('total_score')->values();

            $rank = 0;
            $position = 0;
            $previousScore = null;

            $ranked = $gradeStudentEntries->map(function ($entry) use (&$rank, &$position, &$previousScore) {
                $position++;
                $isRepeated = $previousScore !== null && $entry['total_score'] === $previousScore;
                if (!$isRepeated) {
                    $rank = $position;
                }
                $previousScore = $entry['total_score'];

                return array_merge($entry, [
                    'rank' => $rank,
                    'is_repeated' => $isRepeated,
                ]);
            })->take(30);

            if ($ranked->isNotEmpty()) {
                $gradesData[] = [
                    'grade' => $g,
                    'grade_name' => $gradeModels->get($g)?->name,
                    'max_score' => $maxScore,
                    'students' => $ranked->toArray(),
                ];
            }
        }

        return [
            'academic_year' => $academicYear,
            'language' => $language,
            'semester' => $semester,
            'level' => $level,
            'grades' => $gradesData,
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

    private function emptyResponse(string $academicYear, int $grade, string $language, string $semester, bool $detailed = false): array
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
                'columns_count' => 2,
            ],
        ];
    }

    private function emptyTopResponse(string $academicYear, string $language, string $semester, string $level): array
    {
        return [
            'academic_year' => $academicYear,
            'language' => $language,
            'semester' => $semester,
            'level' => $level,
            'grades' => [],
        ];
    }
}
