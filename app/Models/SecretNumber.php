<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecretNumber extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'grade',
        'group_number',
        'group_capacity',
        'academic_year',
        'language',
        'level',
        'starts_at',
        'ends_at',
        'semester',
    ];
}
