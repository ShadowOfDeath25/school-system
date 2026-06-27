<?php

namespace App\Http\Requests\Exam;

use App\Models\GradeSubject;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'language' => ['required', 'string', Rule::in(['عربي', 'لغات', 'Ø¹Ø±Ø¨ÙŠ', 'Ù„ØºØ§Øª']), 'max:255'],
            'duration_in_hours' => ['required', 'numeric'],
            'type' => ['required', 'string', Rule::in(['دور اول', 'دور أول', 'دور ثاني', 'دور تاني', 'Ø¯ÙˆØ± Ø§ÙˆÙ„', 'Ø¯ÙˆØ± Ø«Ø§Ù†ÙŠ', 'Ø¯ÙˆØ± ØªØ§Ù†ÙŠ']), 'max:255'],
            'academic_year' => ['required', 'string', 'exists:academic_years,name'],
            'grade_subject_id' => ['required', 'exists:grade_subject,id'],
            'component_id' => ['required', 'string'],
            'semester' => ['required', 'string', Rule::in(['الاول', 'الأول', 'الثاني', 'Ø§Ù„Ø§ÙˆÙ„', 'Ø§Ù„Ø£ÙˆÙ„', 'Ø§Ù„Ø«Ø§Ù†ÙŠ'])],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $gradeSubject = GradeSubject::find($this->grade_subject_id);

            if (! $gradeSubject || $gradeSubject->component($this->component_id)) {
                return;
            }

            $validator->errors()->add('component_id', 'المكون المختار غير موجود لهذه المادة.');
        });
    }
}