<?php

namespace App\Traits\Requests;

use App\Enums\PaymentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait HasReportFilters
{
    /**
     * Get the common report validation rules.
     *
     * @return array<string, ValidationRule|array<string>|string>
     */
    protected function baseReportFilters(): array
    {
        return [
            'academic_year' => ['required', 'string', 'max:255'],
            'language' => ['nullable', 'string', Rule::in(['عربي', 'لغات'])],
            'level' => ['required_with:grade', 'string', Rule::in(['ابتدائي', 'اعدادي', 'رياض اطفال'])],
            'grade' => ['integer', 'min:1', 'max:12'],
            'classroom' => ['nullable', 'integer', 'exists:classrooms,id'],
            'min' => ['nullable', 'numeric', 'min:0'],
            'sorting' => ['nullable', 'string', Rule::in(['maleFirst', 'femaleFirst'])],
            'type' => ['nullable', 'string', Rule::in([
                PaymentType::ADMINISTRATIVE->value,
                PaymentType::TUITION->value,
                PaymentType::UNIFORM->value,
                PaymentType::BOOK->value,
                PaymentType::ADDITIONAL->value,
                PaymentType::WITHDRAWAL->value,
            ])],
        ];
    }
}
