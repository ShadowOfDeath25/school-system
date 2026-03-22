<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SeatNumber extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'level',
        'grade',
        'language',
        'academic_year',
        'starts_at',
        'ends_at',
    ];
}
