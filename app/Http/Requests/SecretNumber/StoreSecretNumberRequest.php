<?php

namespace App\Http\Requests\SecretNumber;

use App\Models\SecretNumber;
use Illuminate\Foundation\Http\FormRequest;

class StoreSecretNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'grade' => ['required', 'integer'],
            'group_number' => ['numeric', 'max:255'],
            'group_capacity' => ['required', 'integer', 'max:255'],
            'academic_year' => ['required', 'exists:academic_years,name'],
            'language' => ['required', 'string', 'max:255', 'in:عربي,لغات'],
            'level' => ['required', 'string', 'max:255'],
            'starts_at' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $overlap = SecretNumber::where('level', $this->level)
                        ->where('grade', (string) $this->grade)
                        ->where('language', $this->language)
                        ->where('academic_year', $this->academic_year)
                        ->where('semester', $this->semester)
                        ->where('starts_at', '<=', (int) $this->ends_at)
                        ->where('ends_at', '>=', (int) $value)
                        ->exists();

                    if ($overlap) {
                        $fail('نطاق الأرقام السرية هذا يتداخل مع نطاق موجود مسبقاً لنفس المجموعة');
                    }
                },
            ],
            'ends_at' => ['required', 'numeric', 'gt:starts_at'],
            'semester' => ['required', 'string', 'in:الاول,الثاني,طوال العام'],
        ];
    }
}
