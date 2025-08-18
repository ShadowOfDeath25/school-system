<?php

namespace App\Http\Requests\StudentParent;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentParentRequest extends FormRequest
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
            'name' => ['string'],
            'gender' => ['in:male,female'],
            'phone_number' => ['string',
                'regex:/^(?:\+20)?1[0125][0-9]{8}$/',
                Rule::unique('student_parents', 'phone_number')
                    ->ignore($this->route('parent'))],
            'edu' => ['string'],
            'student_id' => ['exists:students,id'],
            'job' => ['string'],
        ];
    }
}
