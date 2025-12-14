<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exemption extends Model
{
    protected $fillable = [
        'student_id',
        'type',
        'value',
    ];
}
