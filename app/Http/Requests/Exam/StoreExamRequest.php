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
            'language' => ['required', 'string', 'max:255'],
            'level' => ['required', 'string', 'max:255'],
            'duration_in_hours' => ['required', 'numeric'],
            'max_marks' => ['required', 'integer'],
            'min_marks' => ['required', 'integer'],
            'type' => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:255'],
            'grade' => ['required', 'integer'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],

        ];

    }
}
