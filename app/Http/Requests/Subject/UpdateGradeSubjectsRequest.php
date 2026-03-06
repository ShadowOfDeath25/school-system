<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeSubjectsRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subjects' => ['array'],
            'subjects.*.min_marks' => ['numeric'],
            'subjects.*.subject_id' => ["exists:subjects,id"],
            'subjects.*.max_marks' => ['numeric', 'gt:subjects.*.min_marks'],
            'subjects.*.added_to_total' => ['boolean'],
            'subjects.*.added_to_report' => ['boolean'],
            'subjects.*.semester' => ['string', 'in:الاول,الثاني,طوال العام'],
            'subjects.*.language' => ['string', "in:عربي,لغات"]
        ];
    }
}
