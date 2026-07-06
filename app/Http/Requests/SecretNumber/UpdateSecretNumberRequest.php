<?php

namespace App\Http\Requests\SecretNumber;

use App\Models\SecretNumber;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSecretNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'grade' => ['integer'],
            'group_number' => ['numeric', 'max:255'],
            'group_capacity' => ['integer', 'max:255'],
            'academic_year' => ['exists:academic_years,name'],
            'language' => ['string', 'max:255', 'in:عربي,لغات'],
            'level' => ['string', 'max:255'],
            'starts_at' => ['numeric'],
            'ends_at' => ['numeric', 'gt:starts_at'],
            'semester' => ['string', 'in:الأول,الثاني,طوال العام'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $record = SecretNumber::find((int) $this->route('secret_number'));

            if (! $record) {
                return;
            }

            $level = $this->level ?? $record->level;
            $grade = $this->grade ?? $record->grade;
            $language = $this->language ?? $record->language;
            $academicYear = $this->academic_year ?? $record->academic_year;
            $semester = $this->semester ?? $record->semester;
            $startsAt = $this->starts_at ?? $record->starts_at;
            $endsAt = $this->ends_at ?? $record->ends_at;

            $overlap = SecretNumber::where('level', $level)
                ->where('grade', (string) $grade)
                ->where('language', $language)
                ->where('academic_year', $academicYear)
                ->where('semester', $semester)
                ->where('id', '!=', $record->id)
                ->where('starts_at', '<=', (int) $endsAt)
                ->where('ends_at', '>=', (int) $startsAt)
                ->exists();

            if ($overlap) {
                $validator->errors()->add('starts_at', 'نطاق الأرقام السرية هذا يتداخل مع نطاق موجود مسبقاً لنفس المجموعة');
            }
        });
    }
}
