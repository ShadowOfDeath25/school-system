<?php

namespace App\Http\Requests\SecretAssignment;

use Illuminate\Foundation\Http\FormRequest;

class TriggerSecretAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'exists:academic_years,name'],
            'semester' => ['nullable', 'string', 'in:الاول,الثاني,طوال العام'],
            'level' => ['nullable', 'string', 'in:ابتدائي,رياض أطفال,اعدادي'],
            'grade' => ['nullable', 'integer'],
            'language' => ['nullable', 'string', 'in:عربي,لغات'],
        ];
    }
}
