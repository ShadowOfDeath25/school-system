<?php

namespace App\Http\Requests\StudentParent;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentParentRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'gender' => ['required', 'in:male,female'],
            'phone_number' => ['required', 'string', 'regex:/^(?:\+20)?1[0125][0-9]{8}$/', 'unique:student_parents,phone_number'],
            'edu' => ['required', 'string'],
            'student_id' => ['required', 'exists:students,id'],
            'job' => ['required', 'string'],
        ];
    }
}
