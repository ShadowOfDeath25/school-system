<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSecretAssignment extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'student_id',
        'secret_number_id',
        'assigned_number',
        'academic_year',
        'semester',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function secretNumberConfig(): BelongsTo
    {
        return $this->belongsTo(SecretNumber::class, 'secret_number_id');
    }
}
