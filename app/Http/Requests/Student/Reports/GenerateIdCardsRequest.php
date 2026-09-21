<?php

namespace App\Http\Requests\Student\Reports;

use Illuminate\Foundation\Http\FormRequest;

class GenerateIdCardsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required_without:student_id', 'nullable', 'string', 'exists:academic_years,name'],
            'language' => ['nullable', 'string', 'in:عربي,لغات'],
            'level' => ['nullable', 'string', 'in:ابتدائي,اعدادي,رياض أطفال'],
            'grade' => ['nullable', 'integer', 'min:1', 'max:11'],
            'classroom' => ['nullable', 'integer', 'exists:classrooms,id'],
            'layout' => ['nullable', 'string', 'in:grid,single'],
            'student_id' => ['nullable', 'integer', 'exists:students,id'],
        ];
    }
}
