<?php

namespace App\Observers;

use App\Models\Student;

class StudentObserver
{
    public function creating(Student $student): void
    {
        $student->assignRegNum();
        $student->assignPaymentValues();
    }

    public function updating(Student $student): void
    {
        if ($student->isDirty(['classroom_id', 'language', 'level', 'withdrawn'])) {
            $student->assignPaymentValues();
        }
    }
}
