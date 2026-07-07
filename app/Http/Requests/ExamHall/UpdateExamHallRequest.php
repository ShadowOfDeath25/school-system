<?php

namespace App\Http\Requests\ExamHall;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExamHallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'classroom_id' => [
                'exists:classrooms,id',
                Rule::unique('exam_halls')
                    ->where('academic_year', $this->input('academic_year', \App\Models\AcademicYear::activeCached()?->name))
                    ->ignore($this->route('exam_hall')),
            ],
            'capacity' => 'integer|min:1',
            'academic_year' => 'nullable|exists:academic_years,name',
        ];
    }
}
