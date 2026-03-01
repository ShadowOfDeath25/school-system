<?php

namespace App\Http\Requests\Student\Reports;

use App\Enums\PaymentType;
use App\Traits\Requests\HasReportFilters;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GenerateDailyPaymentsReportRequest extends FormRequest
{
    use HasReportFilters;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'date_format:Y-m-d'],
            'type' => ['required', 'string', new Enum(PaymentType::class)],
            'academic_year' => ['required', 'string', 'exists:academic_years,name']
        ];
    }
}
