<?php

namespace App\Http\Requests\Student\Reports;

use Illuminate\Foundation\Http\FormRequest;

class GenerateStudentStatsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'string', 'max:255'],
            'language' => ['nullable', 'string', 'in:عربي,لغات'],
            'level' => ['nullable', 'string', 'in:ابتدائي,اعدادي,رياض أطفال'],
            'grade' => ['required', 'integer', 'min:1', 'max:12'],
            'classroom' => ['nullable', 'integer', 'exists:classrooms,id'],
        ];
    }
}
