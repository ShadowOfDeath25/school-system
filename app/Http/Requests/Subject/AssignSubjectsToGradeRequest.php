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
            'min_marks' => ['numeric', 'required'],
            'max_marks' => ['numeric', 'required', 'gt:min_marks'],
            'classwork_marks' => ['numeric', 'lt:max_marks', 'required'],
            'added_to_total' => ['boolean'],
            'added_to_report' => ['boolean'],
            'semester' => ['string', 'required', 'in:الاول,الثاني,طوال العام'],
            'language' => ['string', 'required', 'in:عربي,لغات'],
        ];
    }
}
