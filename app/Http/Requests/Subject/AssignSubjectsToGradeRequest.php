<?php

namespace App\Http\Requests\Subject;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssignSubjectsToGradeRequest extends FormRequest
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
            'subject_id' => ['required', 'exists:subjects,id'],
            'min_marks' => ['numeric', 'required', 'min:0'],
            'components' => ['required', 'array', 'min:1'],
            'components.*.id' => ['nullable', 'string', 'max:255'],
            'components.*.name' => ['required', 'string', 'max:255'],
            'components.*.marks' => ['required', 'numeric', 'gt:0'],
            'components.*.is_final_exam' => ['required', 'boolean'],
            'added_to_total' => ['boolean'],
            'added_to_report' => ['boolean'],
            'semester' => ['string', 'required', 'in:الاول,الثاني,طوال العام'],
            'language' => ['string', 'required', 'in:عربي,لغات'],
        ];
    }
}
