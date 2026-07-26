<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GradeAge extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'grade_id', 'min_years', 'min_months', 'max_years', 'max_months',
    ];

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }
}
