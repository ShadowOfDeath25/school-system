<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class subject extends Model
{
    protected $fillable = [
        'subject_name',
        'max_degree',
        'phase',
        'term',
        'language',
        'academic_year',
        'added_to_total',
    ];
}
