<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
            'max_marks' => ['required', 'integer'],
            'min_marks' => ['required', 'integer'],
            'level' => ['required', 'string', 'max:50'],
            'semester' => ['required', 'string', 'max:50'],
            'language' => ['required', 'string', 'max:50'],
            'academic_year' => ['required', 'exists:academic_years,name'],
            'added_to_total' => ['required', 'integer', 'min:0', 'max:1'],
            'added_to_report' => ['required', 'integer', 'min:0', 'max:1'],
            'type' => ['required', 'string'],
            'grade' => ['required', 'integer']
        ];
    }
}
