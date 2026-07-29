<?php

namespace App\Observers;

use App\Models\AcademicYear;
use App\Models\ExtraDue;
use App\Models\PaymentValue;
use App\Models\Student;
use App\Services\StudentPaymentsService;
use Cache;

class AcademicYearObserver
{
    /**
     * Handle the AcademicYear "created" event.
     */
    public function created(AcademicYear $academicYear): void
    {
        PaymentValue::AddNewAcademicYear($academicYear->name);

        $activeYear = AcademicYear::activeCached();
        if (! $activeYear || $activeYear->id === $academicYear->id) {
            return;
        }

        $service = new StudentPaymentsService;

        Student::query()
            ->where('transferred_out', false)
            ->chunkById(100, function ($students) use ($service, $activeYear, $academicYear) {
                foreach ($students as $student) {
                    $payments = $service->getStudentPayments($student, $activeYear->name);

                    foreach (StudentPaymentsService::PAYMENT_TYPES as $key => $type) {
                        $remaining = $payments['remaining'][$type] ?? 0;
                        if ($remaining > 0) {
                            ExtraDue::create([
                                'student_id' => $student->id,
                                'academic_year' => $academicYear->name,
                                'value' => $remaining,
                                'note' => "{$type} متبقي من {$activeYear->name}",
                            ]);
                        }
                    }
                }
            });
    }

    /**
     * Handle the AcademicYear "updated" event.
     */
    public function updated(AcademicYear $academicYear): void
    {
        //
    }

    /**
     * Handle the AcademicYear "deleted" event.
     */
    public function deleted(AcademicYear $academicYear): void
    {
        Cache::forget('academic_year.active');
    }

    /**
     * Handle the AcademicYear "restored" event.
     */
    public function restored(AcademicYear $academicYear): void
    {
        //
    }

    /**
     * Handle the AcademicYear "force deleted" event.
     */
    public function forceDeleted(AcademicYear $academicYear): void
    {
        //
    }

    public function saved(AcademicYear $academicYear): void
    {
        if ($academicYear->wasChanged('active')) {
            Cache::forget('academic_year.active');
        }
    }
}
