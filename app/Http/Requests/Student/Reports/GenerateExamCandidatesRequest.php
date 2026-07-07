<?php

namespace App\Http\Requests\Student\Reports;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateExamCandidatesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'string', 'max:255'],
            'level' => ['nullable', 'string', Rule::in(['ابتدائي', 'اعدادي', 'رياض أطفال'])],
            'grade' => ['nullable', 'integer', 'min:1', 'max:12'],
            'language' => ['nullable', 'string', Rule::in(['عربي', 'لغات'])],
            'classroom_id' => ['nullable', 'integer', 'exists:classrooms,id'],
        ];
    }

    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'academicYear' => $validated['academic_year'],
            'level' => $validated['level'] ?? null,
            'grade' => isset($validated['grade']) ? (int) $validated['grade'] : null,
            'language' => $validated['language'] ?? null,
            'classroomId' => isset($validated['classroom_id']) ? (int) $validated['classroom_id'] : null,
        ];
    }
}
