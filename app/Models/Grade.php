<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Grade extends Model
{
    protected $fillable = [
        'name', 'grade'
    ];


    public function subjects(): BelongsToMany
    {
        return $this->BelongsToMany(Subject::class)->using(GradeSubject::class)->withPivot(['min_marks', 'max_marks', 'added_to_total', 'added_to_report', 'semester']);
    }

}
