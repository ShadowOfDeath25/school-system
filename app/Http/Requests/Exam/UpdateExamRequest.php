<?php

namespace App\Http\Requests\Exam;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'name' => ['string', 'max:255'],
            'date' => ['date'],
            'language' => ['string', "in:عربي,لغات", 'max:255'],
            'duration_in_hours' => ['numeric'],
            'type' => ['string', "in:دور اول,دور تاني", 'max:255'],
            'academic_year' => ['string', 'exists:academic_years,name'],
            'grade_subject_id' => ['exists:grade_subject,id'],
            'semester' => ["string", 'in:الاول,الثاني']
        ];
    }
}
