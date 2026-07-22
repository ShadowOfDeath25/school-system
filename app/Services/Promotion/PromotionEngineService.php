<?php

namespace App\Services\Promotion;

use App\Models\AcademicYear;
use App\Models\PromotionBatch;
use App\Models\PromotionBatchStudent;
use App\Models\Student;
use App\Models\StudentSecretAssignment;
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
            ->whereIn('status', ['pending', 'completed'])
            ->exists();

        if ($existing) {
            throw new \RuntimeException("يوجد بالفعل عملية ترقية لهذين العامين الدراسيين");
        }

        return DB::transaction(function () use (
            $fromAcademicYear, $toYear, $grade, $studentIds, $createdBy, $fromYear
        ) {
            $batch = PromotionBatch::create([
                'from_academic_year' => $fromAcademicYear,
                'to_academic_year' => $toYear->name,
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

            $promotedCount = 0;
            $repeatedCount = 0;
            $graduatedCount = 0;

            foreach ($students as $student) {
                $result = $this->eligibility->evaluateStudent($student, $fromYear);
                $category = $result['category'];

                switch ($category) {
                    case 'passed':
                        $targetGrade = $student->grade + 1;
                        $level = $this->eligibility->levelForGrade($targetGrade);
                        $classroom = $this->allocator->allocate($student, $targetGrade, $toYear->name);
                        $this->enrollment->enrollStudent(
                            $student, $batch, 'promoted', $targetGrade, $classroom, $toYear->name,
                        );
                        $promotedCount++;
                        break;

                    case 'graduated':
                        $this->enrollment->enrollStudent(
                            $student, $batch, 'graduated', null, null, $toYear->name,
                        );
                        $graduatedCount++;
                        break;

                    case 'repeat':
                        $classroom = $this->allocator->allocate($student, $student->grade, $toYear->name);
                        $this->enrollment->enrollStudent(
                            $student, $batch, 'repeated', $student->grade, $classroom, $toYear->name,
                        );
                        $repeatedCount++;
                        break;

                    case 'دور_ثاني_eligible':
                        PromotionBatchStudent::create([
                            'promotion_batch_id' => $batch->id,
                            'student_id' => $student->id,
                            'from_grade' => $student->grade,
                            'to_grade' => null,
                            'from_classroom_id' => $student->classroom_id,
                            'decision' => 'دور_ثاني',
                        ]);
                        break;
                }
            }

            $batch->update([
                'total_students' => $students->count(),
                'promoted_count' => $promotedCount,
                'repeated_count' => $repeatedCount,
                'graduated_count' => $graduatedCount,
                'status' => 'completed',
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
        string $toAcademicYear,
    ): void {
        DB::transaction(function () use ($batch, $student, $subjectResults, $toAcademicYear) {
            $batchStudent = PromotionBatchStudent::where('promotion_batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->where('decision', 'دور_ثاني')
                ->whereNull('second_round_passed')
                ->firstOrFail();

            $allPassed = collect($subjectResults)->every(fn ($r) => $r['passed']);

            if ($allPassed) {
                $targetGrade = $student->grade + 1;
                $level = app(PromotionEligibilityService::class)->levelForGrade($targetGrade);
                $classroom = $this->allocator->allocate($student, $targetGrade, $toAcademicYear);

                $this->enrollment->enrollStudent(
                    $student, $batch, 'promoted', $targetGrade, $classroom, $toAcademicYear,
                    notes: 'دور ثاني - نجح',
                );

                $batchStudent->update(['second_round_passed' => true]);
                $batch->increment('promoted_count');
            } else {
                $classroom = $this->allocator->allocate($student, $student->grade, $toAcademicYear);
                $this->enrollment->enrollStudent(
                    $student, $batch, 'repeated', $student->grade, $classroom, $toAcademicYear,
                    notes: 'دور ثاني - رسب',
                );

                $batchStudent->update(['second_round_passed' => false]);
                $batch->increment('repeated_count');
            }
        });
    }

    /**
     * @throws Throwable
     */
    public function promoteSecondRoundStudent(PromotionBatch $batch, Student $student): void
    {
        DB::transaction(function () use ($batch, $student) {
            $batchStudent = PromotionBatchStudent::where('promotion_batch_id', $batch->id)
                ->where('student_id', $student->id)
                ->where('decision', 'دور_ثاني')
                ->whereNull('second_round_passed')
                ->firstOrFail();

            $toAcademicYear = $batch->to_academic_year;
            $targetGrade = $student->grade + 1;
            $classroom = $this->allocator->allocate($student, $targetGrade, $toAcademicYear);

            $this->enrollment->enrollStudent(
                $student, $batch, 'promoted', $targetGrade, $classroom, $toAcademicYear,
                notes: 'دور ثاني - نجح',
            );

            StudentSecretAssignment::where('student_id', $student->id)
                ->where('academic_year', $batch->from_academic_year)
                ->delete();

            $batchStudent->update(['second_round_passed' => true]);
            $batch->increment('promoted_count');
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
        preg_match('/(\d{4})/', $fromName, $matches);
        $startYear = (int) ($matches[1] ?? date('Y'));
        $nextStart = $startYear + 1;
        $nextEnd = $nextStart + 1;
        $separator = preg_match('/\//', $fromName) ? '/' : (preg_match('/_/', $fromName) ? '_' : '-');
        $newName = "{$nextStart}{$separator}{$nextEnd}";

        return AcademicYear::firstOrCreate(
            ['name' => $newName],
            ['active' => false],
        );
    }
}
