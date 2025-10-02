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
            'language' => ['string', 'max:255'],
            'level' => ['string', 'max:255'],
            'duration_in_hours' => ['numeric'],
            'max_marks' => ['numeric'],
            'min_marks' => ['numeric'],
            'type' => ['string', 'max:255'],
            'academic_year' => ['string', 'max:255'],
            'grade' => ['string', 'max:255'],
            'subject_id' => ['string', 'max:255', 'exists:subjects,id'],
        ];
    }
}
