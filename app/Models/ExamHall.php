<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamHall extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        "capacity",
        "academic_year",
        "classroom_id",
        "number",
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (ExamHall $examHall) {
            $examHall->number = static::where('academic_year', $examHall->academic_year)
                ->max('number') + 1;
        });
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }
}
