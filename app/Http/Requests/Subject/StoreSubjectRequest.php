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
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject_name' => ['required', 'string', 'max:255'],
            'max_degree' => ['required', 'numeric'],
            'phase' => ['required', 'string', 'max:50'],
            'term' => ['required', 'string', 'max:50'],
            'language' => ['required', 'string', 'max:50'],
            'academic_year' => ['required', 'integer'],
            'added_to_total' =>['required', 'string', Rule::in(['نعم ', 'لا'])],
        ];
    }
}
