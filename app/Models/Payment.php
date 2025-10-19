<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'academic_year',
        'language',
        'type',
        "value",
        "student_id",
        "level"
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
