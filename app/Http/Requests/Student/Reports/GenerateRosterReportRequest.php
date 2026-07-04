<?php

namespace App\Http\Requests\Student\Reports;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateRosterReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'string', 'max:255'],
            'language' => ['nullable', 'string', Rule::in(['عربي', 'لغات'])],
            'level' => ['nullable', 'string', Rule::in(['ابتدائي', 'اعدادي', 'رياض أطفال'])],
            'grade' => ['nullable', 'integer', 'min:1', 'max:12'],
            'classroom' => ['nullable', 'integer', 'exists:classrooms,id'],
            'status' => ['nullable', 'string', Rule::in(['مستجد', 'مقيد'])],
            'religion' => ['nullable', 'string', Rule::in(['مسلم', 'مسيحي'])],
            'gender' => ['nullable', 'string', Rule::in(['male', 'female'])],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', Rule::in(['name_in_arabic', 'birth_date', 'status', 'created_at', 'gender', 'religion'])],
            'sort_dir' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:500'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
