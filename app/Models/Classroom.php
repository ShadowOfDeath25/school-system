<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{

    protected $fillable = [
        'language',
        'level',
        'grade',
        'class_number',
        'actual_capacity',
        'max_capacity',
        'academic_year'
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }


}
