<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'language' => ['required', 'string', "in:عربي,لغات", 'max:255'],
            'duration_in_hours' => ['required', 'numeric'],
            'type' => ['required', 'string', "in:دور اول,دور تاني", 'max:255'],
            'academic_year' => ['required', 'string', 'exists:academic_years,name'],
            'grade_subject_id' => ['required', 'exists:grade_subject,id'],
            'semester'=>['required',"string",'in:الاول,الثاني']
        ];

    }
}
