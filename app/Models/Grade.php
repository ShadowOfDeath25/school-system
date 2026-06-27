<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Grade extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'name', 'grade',
    ];

    public function subjects(): BelongsToMany
    {
        return $this->BelongsToMany(Subject::class)
            ->using(GradeSubject::class)
            ->withPivot(['id', 'min_marks', 'max_marks', 'added_to_total', 'added_to_report', 'semester', 'components', 'language']);
    }
}
