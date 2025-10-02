<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'max_marks',
        'min_marks',
        'grade',
        'type',
        'level',
        'semester',
        'language',
        'academic_year',
        'added_to_total',
        'added_to_report'
    ];


    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }


}
