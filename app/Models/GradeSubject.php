<?php

namespace App\Models;

use App\Services\GradingComponentService;
use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class GradeSubject extends Pivot
{
    use LogsActivityInArabic;

    protected $table = 'grade_subject';

    protected $fillable = [
        'subject_id',
        'grade_id',
        'min_marks',
        'max_marks',
        'added_to_total',
        'added_to_report',
        'semester',
        'language',
        'components',
        'use_monthly_median',
    ];

    protected $casts = [
        'components' => 'array',
        'added_to_total' => 'boolean',
        'added_to_report' => 'boolean',
        'use_monthly_median' => 'boolean',
    ];

    public function getTotalMarksAttribute(): float|int
    {
        if ($this->use_monthly_median) {
            $components = collect($this->components ?? []);
            $monthly = $components->where('is_monthly_exam', true);
            $nonMonthly = $components->reject(fn ($c) => ($c['is_monthly_exam'] ?? false) === true);

            if ($this->semester === 'طوال العام') {
                $s1Monthly = $monthly->filter(fn ($c) => GradingComponentService::isSemester1ComponentId($c['id'] ?? ''));
                $s2Monthly = $monthly->filter(fn ($c) => GradingComponentService::isSemester2ComponentId($c['id'] ?? ''));
                $otherMonthly = $monthly->reject(fn ($c) => $s1Monthly->contains($c) || $s2Monthly->contains($c));

                $s1Avg = $s1Monthly->isNotEmpty() ? (float) $s1Monthly->avg(fn ($c) => (float) ($c['marks'] ?? 0)) : 0;
                $s2Avg = $s2Monthly->isNotEmpty() ? (float) $s2Monthly->avg(fn ($c) => (float) ($c['marks'] ?? 0)) : 0;
                $otherAvg = $otherMonthly->isNotEmpty() ? (float) $otherMonthly->avg(fn ($c) => (float) ($c['marks'] ?? 0)) : 0;

                $monthlyEffective = $s1Avg + $s2Avg + $otherAvg;
            } else {
                $monthlyEffective = $monthly->isNotEmpty() ? (float) $monthly->avg(fn ($c) => (float) ($c['marks'] ?? 0)) : 0;
            }

            $nonMonthlySum = (float) $nonMonthly->sum(fn ($c) => (float) ($c['marks'] ?? 0));

            return $nonMonthlySum + $monthlyEffective;
        }

        return collect($this->components ?? [])->sum(fn ($component) => (float) ($component['marks'] ?? 0));
    }

    public function calculateStudentSubjectTotal(mixed $componentMarks): ?float
    {
        $marksCollection = collect($componentMarks);
        if ($marksCollection->isEmpty()) {
            return null;
        }

        if (! $this->use_monthly_median) {
            return (float) $marksCollection->sum();
        }

        $components = collect($this->components ?? []);
        $monthlyComponents = $components->where('is_monthly_exam', true);

        if ($monthlyComponents->isEmpty()) {
            return (float) $marksCollection->sum();
        }

        $monthlyIds = $monthlyComponents->pluck('id')->all();

        $nonMonthlySum = (float) $marksCollection->reject(fn ($mark, $compId) => in_array($compId, $monthlyIds))->sum();
        $relevantMonthlyMarks = $marksCollection->filter(fn ($mark, $compId) => in_array($compId, $monthlyIds));

        if ($relevantMonthlyMarks->isEmpty()) {
            return $nonMonthlySum;
        }

        if ($this->semester === 'طوال العام') {
            $s1MonthlyIds = $monthlyComponents->filter(fn ($c) => GradingComponentService::isSemester1ComponentId($c['id'] ?? ''))->pluck('id')->all();
            $s2MonthlyIds = $monthlyComponents->filter(fn ($c) => GradingComponentService::isSemester2ComponentId($c['id'] ?? ''))->pluck('id')->all();

            $s1Marks = $relevantMonthlyMarks->filter(fn ($m, $id) => in_array($id, $s1MonthlyIds));
            $s2Marks = $relevantMonthlyMarks->filter(fn ($m, $id) => in_array($id, $s2MonthlyIds));

            $s1Avg = count($s1MonthlyIds) > 0 && $s1Marks->isNotEmpty() ? ($s1Marks->sum() / count($s1MonthlyIds)) : 0;
            $s2Avg = count($s2MonthlyIds) > 0 && $s2Marks->isNotEmpty() ? ($s2Marks->sum() / count($s2MonthlyIds)) : 0;

            return (float) ($nonMonthlySum + $s1Avg + $s2Avg);
        }

        $monthlyAvg = $monthlyComponents->count() > 0 ? ($relevantMonthlyMarks->sum() / $monthlyComponents->count()) : 0;

        return (float) ($nonMonthlySum + $monthlyAvg);
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