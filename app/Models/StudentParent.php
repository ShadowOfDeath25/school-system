<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentParent extends Model
{
    protected $fillable = [
        'name',
        'edu',
        'gender',
        'phone_number',
        'job',
        'student_id'
    ];


}
