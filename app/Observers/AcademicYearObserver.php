<?php

namespace App\Observers;

use App\Models\AcademicYear;
use App\Models\PaymentValue;
use Cache;

class AcademicYearObserver
{
    /**
     * Handle the AcademicYear "created" event.
     */
    public function created(AcademicYear $academicYear): void
    {
        PaymentValue::AddNewAcademicYear($academicYear->name);
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
    public function saved(AcademicYear $academicYear):void
    {
        if ($academicYear->wasChanged('active')){
            Cache::forget('academic_year.active');
        }
    }
}
