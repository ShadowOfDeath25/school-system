<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivityInArabic;

class Subject extends Model
{
    use LogsActivityInArabic, HasFactory;

    protected $fillable = [
        'name',
        'type',
        'language',
    ];


    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function grades(): BelongsToMany
    {
        return $this->BelongsToMany(Grade::class)
            ->using(GradeSubject::class)
            ->withPivot(['min_marks', 'max_marks', 'grade_id', 'added_to_total', 'added_to_report', 'semester', 'classwork_marks']);
    }


}
