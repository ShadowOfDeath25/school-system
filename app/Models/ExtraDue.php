<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraDue extends Model
{
    protected $fillable = [
        'note',
        'student_id',
        'value',
        'academic_year'
    ];
}
