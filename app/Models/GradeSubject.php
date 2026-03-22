<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Traits\LogsActivityInArabic;

class GradeSubject extends Pivot
{
    use LogsActivityInArabic;
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
