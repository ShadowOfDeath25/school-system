<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class GradeSubject extends Pivot
{
    use LogsActivityInArabic;

    protected $fillable = [
        'subject_id',
        'grade',
        'min_marks',
        'max_marks',
        'added_to_total',
        'added_to_report',
        'semester',
        'language',
        'components',
    ];

    protected $casts = [
        'components' => 'array',
        'added_to_total' => 'boolean',
        'added_to_report' => 'boolean',
    ];

    public function getTotalMarksAttribute(): float|int
    {
        return collect($this->components ?? [])->sum(fn ($component) => (float) ($component['marks'] ?? 0));
    }

    public function getExamMarksAttribute(): float|int
    {
        return collect($this->components ?? [])
            ->where('is_final_exam', true)
            ->sum(fn ($component) => (float) ($component['marks'] ?? 0));
    }

    public function component(?string $componentId): ?array
    {
        if (! $componentId) {
            return null;
        }

        return collect($this->components ?? [])->firstWhere('id', $componentId);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'grade_subject_id');
    }
}