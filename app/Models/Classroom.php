<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classroom extends Model
{

    protected $fillable = [
        'language',
        'level',
        'grade',
        'class_number',
        'actual_capacity',
        'max_capacity',
        'academic_year',
        'floor_id',
        'leader'
    ];

    public function students(): HasMany|Classroom
    {
        return $this->hasMany(Student::class, 'classroom_id');
    }


}
