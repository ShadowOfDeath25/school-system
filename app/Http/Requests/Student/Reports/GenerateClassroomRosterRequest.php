<?php

declare(strict_types=1);

namespace App\Http\Requests\Student\Reports;

use App\Traits\Requests\HasReportFilters;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateClassroomRosterRequest extends FormRequest
{
    use HasReportFilters;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge($this->baseReportFilters(), [
            'status' => ['nullable', 'string', Rule::in(['مستجد', 'مقيد'])],
            'religion' => ['nullable', 'string', Rule::in(['مسلم', 'مسيحي'])],
            'gender' => ['nullable', 'string', Rule::in(['male', 'female'])],
            'export' => ['nullable', 'string', Rule::in(['excel', 'pdf'])],
        ]);
    }
}
