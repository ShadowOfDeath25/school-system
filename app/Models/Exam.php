<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam extends Model
{
    //
    protected $fillable = [
        'name',
        'date',
        'duration_in_hours',
        'academic_year',
        'grade',
        'level',
        'type',
        'language',
        'semester',
        'max_marks',
        'min_marks',
        'subject_id',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }


}
