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
            'min_marks' => ['numeric'],
            'subject_id' => ["exists:subjects,id"],
            'max_marks' => ['numeric', 'gt:min_marks'],
            'added_to_total' => ['boolean'],
            'added_to_report' => ['boolean'],
            'classwork_marks' => ['numeric','lt:max_marks'],
            'semester' => ['string', 'in:الاول,الثاني,طوال العام'],
            'language' => ['string', "in:عربي,لغات"]
        ];
    }
}
