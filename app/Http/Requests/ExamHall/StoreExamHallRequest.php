<?php

namespace App\Http\Requests\ExamHall;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamHallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'classroom_id' => [
                'required',
                'exists:classrooms,id',
                Rule::unique('exam_halls')
                    ->where('academic_year', $this->input('academic_year', \App\Models\AcademicYear::activeCached()?->name)),
            ],
            'capacity' => 'required|integer|min:1',
            'academic_year' => 'nullable|exists:academic_years,name',
        ];
    }
}
