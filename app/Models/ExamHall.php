<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;


class ExamHall extends Model
{
    //
    protected $fillable = [
        'language',
        'floor_id',
        'capacity',
        'grade',
        'level',
        'building_id',
        'semester',
        'number',
        'academic_year',
        'starts_at',
        'ends_at',
    ];
}
