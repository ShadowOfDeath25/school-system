<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Marks extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'student_id',
        'exam_id',
        'marks',
        'component_id',
        'academic_year',
        'round',
    ];

    protected $casts = [
        'marks' => 'decimal:1',
        'round' => 'string',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
}
