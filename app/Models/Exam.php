<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

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
        'max_mark',
        'min_mark',
        'subject_id',
    ];
}
