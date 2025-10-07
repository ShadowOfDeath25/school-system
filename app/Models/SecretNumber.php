<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SecretNumber extends Model
{
    use HasFactory;
    protected $fillable = [
        'grade',
        'group_number',
        'group_capacity',
        'academic_year',
        'language',
        'level',
        'starts_at',
        'ends_at',
        'semester'
    ];
}
