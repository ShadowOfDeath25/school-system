<?php

namespace App\Models;

use App\Observers\ExamObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivityInArabic;

#[ObservedBy(ExamObserver::class)]
class Exam extends Model
{

    use LogsActivityInArabic;

    protected $fillable = [
        'grade_subject_id',
        'academic_year',
        'name',
        'date',
        'type',
        'semester',
        'language',
        'marks',
        'duration_in_hours',
    ];

    public function gradeSubject(): BelongsTo
    {
        return $this->belongsTo(GradeSubject::class);
    }


}
