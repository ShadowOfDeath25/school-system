<?php

namespace App\Services\Promotion;

use App\Models\PromotionBatch;
use App\Models\StudentEnrollment;
use App\Models\StudentSeatAssignment;
use App\Models\StudentSecretAssignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RollbackService
{
    /**
     * @throws \Throwable
     */
    public function rollback(PromotionBatch $batch, User $rolledBackBy): void
    {
        DB::transaction(function () use ($batch, $rolledBackBy) {
            $batchStudents = $batch->batchStudents()
                ->where('rolled_back', false)
                ->get();

            foreach ($batchStudents as $batchStudent) {
                $student = $batchStudent->student;

                if (! $student) {
                    continue;
                }

                $student->update([
                    'grade' => $batchStudent->from_grade,
                    'classroom_id' => $batchStudent->from_classroom_id,
                    'status' => 'active',
                ]);

                StudentSeatAssignment::where('student_id', $batchStudent->student_id)
                    ->where('academic_year', $batch->to_academic_year)
                    ->delete();

                StudentSecretAssignment::where('student_id', $batchStudent->student_id)
                    ->where('academic_year', $batch->to_academic_year)
                    ->delete();

                StudentEnrollment::where('student_id', $batchStudent->student_id)
                    ->where('from_academic_year', $batch->from_academic_year)
                    ->where('to_academic_year', $batch->to_academic_year)
                    ->update(['status' => 'rolled_back']);

                $batchStudent->update(['rolled_back' => true]);
            }

            $batch->update([
                'status' => 'rolled_back',
                'rolled_back_at' => now(),
                'rolled_back_by' => $rolledBackBy->id,
            ]);
        });
    }
}
