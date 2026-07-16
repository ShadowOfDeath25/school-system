<?php

namespace App\Services\Promotion;

use App\Models\Classroom;
use App\Models\PromotionBatch;
use App\Models\PromotionBatchStudent;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\StudentSeatAssignment;
use App\Models\StudentSecretAssignment;
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    public function enrollStudent(
        Student $student,
        PromotionBatch $batch,
        string $decision,
        ?int $toGrade,
        ?Classroom $toClassroom,
        string $toAcademicYear,
        ?string $notes = null,
    ): StudentEnrollment {
        $fromGrade = $student->grade;
        $fromClassroomId = $student->classroom_id;

        return DB::transaction(function () use (
            $student, $batch, $decision, $toGrade, $toClassroom,
            $toAcademicYear, $notes, $fromGrade, $fromClassroomId
        ) {
            $status = $decision === 'graduated' ? 'graduated' : ($decision === 'repeated' ? 'repeated' : 'promoted');

            $enrollment = StudentEnrollment::create([
                'student_id' => $student->id,
                'from_grade' => $fromGrade,
                'to_grade' => $toGrade,
                'from_classroom_id' => $fromClassroomId,
                'to_classroom_id' => $toClassroom?->id,
                'from_academic_year' => $batch->from_academic_year,
                'to_academic_year' => $toAcademicYear,
                'status' => $status,
                'enrolled_at' => now(),
            ]);

            PromotionBatchStudent::create([
                'promotion_batch_id' => $batch->id,
                'student_id' => $student->id,
                'from_grade' => $fromGrade,
                'to_grade' => $toGrade,
                'from_classroom_id' => $fromClassroomId,
                'to_classroom_id' => $toClassroom?->id,
                'decision' => $decision,
                'notes' => $notes,
            ]);

            $this->updateStudentRecord($student, $toGrade, $toClassroom, $status);

            StudentSeatAssignment::where('student_id', $student->id)
                ->where('academic_year', $toAcademicYear)
                ->delete();

            StudentSecretAssignment::where('student_id', $student->id)
                ->where('academic_year', $toAcademicYear)
                ->delete();

            return $enrollment;
        });
    }

    public function updateStudentRecord(Student $student, ?int $newGrade, ?Classroom $classroom, ?string $status): void
    {
        $data = [];

        if ($newGrade !== null) {
            $data['grade'] = $newGrade;
        }

        if ($classroom !== null) {
            $data['classroom_id'] = $classroom->id;
        }

        if ($status !== null) {
            $data['status'] = $status === 'graduated' ? 'graduated' : 'active';
        }

        if (! empty($data)) {
            $student->update($data);
        }
    }
}
