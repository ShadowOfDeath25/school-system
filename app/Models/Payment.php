<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'academic_year',
        'type',
        "value",
        "student_id",
        "level",
        'date'
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
