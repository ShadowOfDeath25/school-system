<?php

namespace App\Observers;

use App\Models\Exam;

class ExamObserver
{
    public function saving(Exam $exam)
    {
        $exam->marks = $exam->gradeSubject?->component($exam->component_id)['marks'] ?? 0;
    }
}
