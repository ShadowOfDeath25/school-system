<?php

namespace App\Http\Requests\GradeAge;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGradeAgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->has('max_years') && ($this->max_years === '' || $this->max_years === null)) {
            $this->merge(['max_years' => null, 'max_months' => null]);
        }
        if ($this->has('max_months') && ($this->max_months === '' || $this->max_months === null)) {
            $this->merge(['max_months' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'grade_id' => ['required', 'exists:grades,id', Rule::unique('grade_ages')],
            'min_years' => ['required', 'integer', 'min:0'],
            'min_months' => ['required', 'integer', 'min:0', 'max:11'],
            'max_years' => ['nullable', 'integer', 'min:0'],
            'max_months' => ['nullable', 'integer', 'min:0', 'max:11'],
        ];
    }
}
