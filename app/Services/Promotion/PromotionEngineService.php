<?php

namespace App\Services\Promotion;

use App\Models\AcademicYear;
use App\Models\PromotionBatch;
use App\Models\PromotionBatchStudent;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class PromotionEngineService
{
    public function __construct(
        private PromotionEligibilityService $eligibility,
        private ClassroomAllocatorService $allocator,
        private EnrollmentService $enrollment,
        private RollbackService $rollback,
    ) {}

    public function preview(string $fromYear, int $grade, ?string $language): Collection
    {
        return $this->eligibility->preview($fromYear, $grade, $language);
    }

    /**
     * @throws Throwable
     */
    public function execute(
        string $fromAcademicYear,
        int $grade,
        ?array $studentIds,
        User $createdBy,
    ): PromotionBatch {
        $fromYear = AcademicYear::where('name', $fromAcademicYear)->firstOrFail();
        $toYear = $this->determineNextAcademicYear($fromAcademicYear);

        $existing = PromotionBatch::where('from_academic_year', $fromAcademicYear)
            ->where('to_academic_year', $toYear->name)
            ->where('grade', $grade)
            ->whereIn('status', ['pending', 'completed'])
            ->exists();

        if ($existing) {
            throw new RuntimeException("يوجد بالفعل عملية ترقية لهذا الصف لهذين العامين الدراسيين");
        }

        return DB::transaction(function () use (
            $fromAcademicYear, $toYear, $grade, $studentIds, $createdBy, $fromYear
        ) {
            $batch = PromotionBatch::create([
                'from_academic_year' => $fromAcademicYear,
                'to_academic_year' => $toYear->name,
                'grade' => $grade,
                'status' => 'pending',
                'created_by' => $createdBy->id,
            ]);

            $query = Student::where('grade', $grade)
                ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
                ->where(function ($q) {
                    $q->where('status', '!=', 'متخرج')
                        ->orWhereNull('status');
                });

            if ($studentIds) {
                $query->whereIn('id', $studentIds);
            }

            $students = $query->get();

            foreach ($students as $student) {
                $result = $this->eligibility->evaluateStudent($student, $fromYear);
                $category = $result['category'];

                $data = [
                    'promotion_batch_id' => $batch->id,
                    'student_id' => $student->id,
                    'from_grade' => $student->grade,
                    'from_classroom_id' => $student->classroom_id,
                    'from_status' => $student->status,
                ];

                switch ($category) {
                    case 'passed':
                        PromotionBatchStudent::create([...$data,
                            'to_grade' => $student->grade + 1,
                            'decision' => 'promoted',
                        ]);
                        break;

                    case 'graduated':
                        PromotionBatchStudent::create([...$data,
                            'to_grade' => null,
                            'decision' => 'graduated',
                        ]);
                        break;

                    case 'دور_ثاني_eligible':
                        PromotionBatchStudent::create([...$data,
                            'to_grade' => null,
                            'decision' => 'دور_ثاني',
                        ]);
                        break;
                }
            }

            $batch->update([
                'total_students' => $students->count(),
            ]);

            return $batch->fresh();
        });
    }

    /**
     * @throws Throwable
     */
    public function resolveSecondRound(
        PromotionBatch $batch,
        Student $student,
        array $subjectResults,
    ): void {
        DB::transaction(function () use ($batch, $student, $subjectResults) {
            $batchStudent = PromotionBatchStudent::where('promotion_batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->where('decision', 'دور_ثاني')
                ->whereNull('second_round_passed')
                ->firstOrFail();

            $allPassed = collect($subjectResults)->every(fn ($r) => $r['passed']);

            $batchStudent->update([
                'second_round_passed' => $allPassed,
                'notes' => $allPassed ? 'دور ثاني - نجح' : 'دور ثاني - رسب',
            ]);
        });
    }

    /**
     * @param array<string, mixed> $config
     * @throws Throwable
     */
    public function finalize(PromotionBatch $batch, array $config = []): void
    {
        if ($batch->status !== 'pending') {
            throw new RuntimeException('لا يمكن إنهاء ترقية غير معلقة');
        }

        $unresolved = $batch->batchStudents()
            ->where('decision', 'دور_ثاني')
            ->whereNull('second_round_passed')
            ->exists();

        if ($unresolved) {
            throw new RuntimeException('يوجد طلاب لم يتم تحديد نتيجة الدور الثاني لهم بعد');
        }

        $toAcademicYear = $batch->to_academic_year;
        $hasGrouping = !empty($config['group_by_gender']) || !empty($config['top_student_count']);

        DB::transaction(function () use ($batch, $toAcademicYear, $config, $hasGrouping) {
            $batchStudents = $batch->batchStudents()
                ->where('rolled_back', false)
                ->get();

            $allocations = [];
            if ($hasGrouping) {
                $promotedStudents = collect();
                $repeatedStudents = collect();

                foreach ($batchStudents as $bs) {
                    $student = $bs->student;
                    if (!$student) {
                        continue;
                    }

                    if ($bs->decision === 'promoted' || ($bs->decision === 'دور_ثاني' && $bs->second_round_passed)) {
                        $promotedStudents->push($student);
                    } elseif ($bs->decision === 'دور_ثاني' && $bs->second_round_passed === false) {
                        $repeatedStudents->push($student);
                    }
                }

                $allIds = $promotedStudents->pluck('id')->merge($repeatedStudents->pluck('id'));
                $scores = DB::table('marks')
                    ->whereIn('student_id', $allIds)
                    ->where('academic_year', $batch->from_academic_year)
                    ->where('round', 'first')
                    ->select('student_id', DB::raw('SUM(marks) as total'))
                    ->groupBy('student_id')
                    ->pluck('total', 'student_id');

                if ($promotedStudents->isNotEmpty()) {
                    $allocations += $this->allocator->allocateBatch(
                        $promotedStudents, $batch->grade + 1, $toAcademicYear, $config, $scores,
                    );
                }
                if ($repeatedStudents->isNotEmpty()) {
                    $allocations += $this->allocator->allocateBatch(
                        $repeatedStudents, $batch->grade, $toAcademicYear, $config, $scores,
                    );
                }
            }

            $promotedCount = 0;
            $repeatedCount = 0;
            $graduatedCount = 0;

            foreach ($batchStudents as $batchStudent) {
                $student = $batchStudent->student;

                if (! $student) {
                    continue;
                }

                $decision = $batchStudent->decision;

                if ($decision === 'promoted') {
                    $classroom = $allocations[$student->id]
                        ?? $this->allocator->allocate($student, $student->grade + 1, $toAcademicYear);
                    $this->enrollment->enrollStudent(
                        $student, $batch, 'promoted', $student->grade + 1, $classroom, $toAcademicYear,
                        skipBatchStudent: true,
                    );
                    $promotedCount++;
                } elseif ($decision === 'graduated') {
                    $this->enrollment->enrollStudent(
                        $student, $batch, 'graduated', null, null, $toAcademicYear,
                        skipBatchStudent: true,
                    );
                    $graduatedCount++;
                } elseif ($decision === 'دور_ثاني') {
                    if ($batchStudent->second_round_passed) {
                        $classroom = $allocations[$student->id]
                            ?? $this->allocator->allocate($student, $student->grade + 1, $toAcademicYear);
                        $this->enrollment->enrollStudent(
                            $student, $batch, 'promoted', $student->grade + 1, $classroom, $toAcademicYear,
                            notes: 'دور ثاني - نجح',
                            skipBatchStudent: true,
                        );
                        $promotedCount++;
                    } else {
                        $classroom = $allocations[$student->id]
                            ?? $this->allocator->allocate($student, $student->grade, $toAcademicYear);
                        $this->enrollment->enrollStudent(
                            $student, $batch, 'repeated', $student->grade, $classroom, $toAcademicYear,
                            notes: 'دور ثاني - رسب',
                            skipBatchStudent: true,
                        );
                        $repeatedCount++;
                    }
                }
            }

            $batch->update([
                'promoted_count' => $promotedCount,
                'repeated_count' => $repeatedCount,
                'graduated_count' => $graduatedCount,
                'status' => 'completed',
            ]);
        });
    }

    public function validateMarksCompleteness(int $grade, string $fromYear): ?Collection
    {
        $languages = Student::where('grade', $grade)
            ->where(fn ($q) => $q->whereNull('withdrawn')->orWhere('withdrawn', false))
            ->where(fn ($q) => $q->where('status', '!=', 'متخرج')->orWhereNull('status'))
            ->distinct()
            ->pluck('language');

        $allMissing = collect();
        foreach ($languages as $language) {
            $missing = $this->eligibility->getStudentsWithMissingMarks($grade, $language, $fromYear);
            $allMissing = $allMissing->concat($missing);
        }

        return $allMissing->isNotEmpty() ? $allMissing : null;
    }

    private function determineNextAcademicYear(string $fromName): AcademicYear
    {
        preg_match_all('/(\d{4})/', $fromName, $matches);
        $years = $matches[1] ?? ['2025', '2024'];
        $endYear = (int) ($years[0] ?? date('Y'));
        $startYear = (int) ($years[1] ?? $endYear - 1);
        $nextEnd = $endYear + 1;
        $nextStart = $startYear + 1;
        $separator = preg_match('/\//', $fromName) ? '/' : (preg_match('/_/', $fromName) ? '_' : '-');
        $newName = "{$nextEnd}{$separator}{$nextStart}";

        return AcademicYear::firstOrCreate(
            ['name' => $newName],
            ['active' => false],
        );
    }
}
