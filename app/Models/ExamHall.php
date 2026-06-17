<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class ExamHall extends Model
{
    use LogsActivityInArabic;

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
