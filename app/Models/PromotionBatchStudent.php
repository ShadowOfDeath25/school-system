<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionBatchStudent extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'promotion_batch_id',
        'student_id',
        'from_grade',
        'to_grade',
        'from_classroom_id',
        'to_classroom_id',
        'decision',
        'second_round_passed',
        'rolled_back',
        'notes',
    ];

    protected $casts = [
        'second_round_passed' => 'boolean',
        'rolled_back' => 'boolean',
    ];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(PromotionBatch::class, 'promotion_batch_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function fromClassroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'from_classroom_id');
    }

    public function toClassroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'to_classroom_id');
    }
}
