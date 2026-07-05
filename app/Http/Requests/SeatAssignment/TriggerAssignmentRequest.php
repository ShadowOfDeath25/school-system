<?php

namespace App\Http\Requests\SeatAssignment;

use Illuminate\Foundation\Http\FormRequest;

class TriggerAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'exists:academic_years,name'],
            'level' => ['nullable', 'string', 'in:ابتدائي,رياض أطفال,اعدادي'],
            'grade' => ['nullable', 'integer'],
            'language' => ['nullable', 'string', 'in:عربي,لغات'],
        ];
    }
}
