<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GradingComponentService
{
    public function normalize(array $components): array
    {
        return collect($components)
            ->values()
            ->map(function (array $component, int $index) {
                $name = trim((string) ($component['name'] ?? ''));
                $id = trim((string) ($component['id'] ?? ''));

                return [
                    'id' => $id !== '' ? Str::slug($id, '_') : 'component_'.($index + 1).'_'.Str::random(6),
                    'name' => $name,
                    'marks' => (float) ($component['marks'] ?? 0),
                    'is_final_exam' => filter_var($component['is_final_exam'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'is_monthly_exam' => filter_var($component['is_monthly_exam'] ?? false, FILTER_VALIDATE_BOOLEAN),
                ];
            })
            ->all();
    }

    public function validate(array $components, ?float $minMarks = null, bool $useMonthlyMedian = false, ?string $semester = null): array
    {
        $components = $this->normalize($components);
        $errors = [];

        if (count($components) === 0) {
            $errors['components'] = ['يجب إضافة مكون واحد على الأقل.'];
        }

        if (! collect($components)->contains(fn ($component) => $component['is_final_exam'])) {
            $errors['components'] = ['يجب تحديد مكون واحد على الأقل كاختبار نهائي.'];
        }

        foreach ($components as $index => $component) {
            if ($component['name'] === '') {
                $errors["components.$index.name"] = ['اسم المكون مطلوب.'];
            }

            if ($component['marks'] <= 0) {
                $errors["components.$index.marks"] = ['درجة المكون يجب أن تكون أكبر من صفر.'];
            }
        }

        $duplicateIds = collect($components)->pluck('id')->duplicates();
        if ($duplicateIds->isNotEmpty()) {
            $errors['components'] = ['معرفات المكونات يجب ألا تتكرر.'];
        }

        if ($minMarks !== null) {
            $totalMarks = $this->totalMarks($components, $useMonthlyMedian, $semester);
            if ($minMarks > $totalMarks) {
                $errors['min_marks'] = ['الحد الأدنى للدرجات لا يمكن أن يكون أكبر من مجموع درجات المكونات.'];
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }

        return $components;
    }

    public function totalMarks(array $components, bool $useMonthlyMedian = false, ?string $semester = null): float|int
    {
        if ($useMonthlyMedian) {
            $monthly = collect($components)->where('is_monthly_exam', true);
            $nonMonthly = collect($components)->reject(fn ($c) => ($c['is_monthly_exam'] ?? false) === true);

            if ($semester === 'طوال العام' || collect($components)->contains(fn ($c) => str_contains($c['id'] ?? '', 'first_semester'))) {
                $s1Monthly = $monthly->filter(fn ($c) => self::isSemester1ComponentId($c['id'] ?? ''));
                $s2Monthly = $monthly->filter(fn ($c) => self::isSemester2ComponentId($c['id'] ?? ''));
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

        return collect($components)->sum(fn ($component) => (float) ($component['marks'] ?? 0));
    }

    public static function isSemester1ComponentId(string $id): bool
    {
        return str_contains($id, 'first_semester')
            || str_starts_with($id, 'monthly_s1')
            || str_contains($id, '_s1_')
            || str_contains($id, 'october')
            || str_contains($id, 'november');
    }

    public static function isSemester2ComponentId(string $id): bool
    {
        return str_contains($id, 'second_semester')
            || str_starts_with($id, 'monthly_s2')
            || str_contains($id, '_s2_')
            || str_contains($id, 'march')
            || str_contains($id, 'april');
    }
}