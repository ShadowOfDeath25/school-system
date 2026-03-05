<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class GradeSubject extends Pivot
{
    protected $fillable = [
        'subject_id',
        'grade',
        'min_marks',
        'max_marks',
        'added_to_total',
        'added_to_report',
        'semester',
    ];
}
