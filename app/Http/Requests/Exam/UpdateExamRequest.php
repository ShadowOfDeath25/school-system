<?php

namespace App\Http\Requests\Exam;

use App\Models\GradeSubject;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'date' => ['date'],
            'language' => ['string', 'in:Ø¹Ø±Ø¨ÙŠ,Ù„ØºØ§Øª', 'max:255'],
            'duration_in_hours' => ['numeric'],
            'type' => ['string', 'in:Ø¯ÙˆØ± Ø§ÙˆÙ„,Ø¯ÙˆØ± ØªØ§Ù†ÙŠ', 'max:255'],
            'academic_year' => ['string', 'exists:academic_years,name'],
            'grade_subject_id' => ['exists:grade_subject,id'],
            'component_id' => ['string'],
            'semester' => ['string', 'in:Ø§Ù„Ø§ÙˆÙ„,Ø§Ù„Ø«Ø§Ù†ÙŠ'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $this->filled('component_id')) {
                return;
            }

            $gradeSubjectId = $this->input('grade_subject_id', $this->route('exam')?->grade_subject_id);
            $gradeSubject = GradeSubject::find($gradeSubjectId);

            if (! $gradeSubject || $gradeSubject->component($this->component_id)) {
                return;
            }

            $validator->errors()->add('component_id', 'المكون المختار غير موجود لهذه المادة.');
        });
    }
}