<?php

namespace App\Http\Requests\Student\Reports;

use App\Traits\Requests\HasReportFilters;
use Illuminate\Foundation\Http\FormRequest;

class GenerateBehaviorRegisterRequest extends FormRequest
{
    use HasReportFilters;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge($this->baseReportFilters(), [
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);
    }
}
