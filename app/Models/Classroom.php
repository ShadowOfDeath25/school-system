<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Builder;

class Classroom extends Model
{
    use HasFactory;

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

    public function scopeActive(Builder|EloquentBuilder $q): Builder|EloquentBuilder
    {
        return $q->where('academic_year', AcademicYear::activeCached()->name);
    }
}
