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
                ];
            })
            ->all();
    }

    public function validate(array $components, ?float $minMarks = null): array
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
            $totalMarks = $this->totalMarks($components);
            if ($minMarks > $totalMarks) {
                $errors['min_marks'] = ['الحد الأدنى للدرجات لا يمكن أن يكون أكبر من مجموع درجات المكونات.'];
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }

        return $components;
    }

    public function totalMarks(array $components): float|int
    {
        return collect($components)->sum(fn ($component) => (float) ($component['marks'] ?? 0));
    }
}