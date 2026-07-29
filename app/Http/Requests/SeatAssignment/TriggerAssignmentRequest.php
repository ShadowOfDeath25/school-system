<?php

namespace App\Http\Requests\SeatAssignment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'sorting' => ['nullable', 'string', Rule::in(['alphabetical', 'males_first', 'females_first'])],
            'redistribute' => ['nullable', 'boolean'],
        ];
    }
}
