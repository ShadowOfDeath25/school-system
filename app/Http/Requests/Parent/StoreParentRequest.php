<?php

namespace App\Http\Requests\Parent;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreParentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'gender' => ['required', 'in:male,female'],
            'phone_number' => ['required', 'string', 'regex:/^(?:\+20|0)?1[0125][0-9]{8}$/', 'unique:parents,phone_number'],
            'edu' => ['required', 'string'],
            'student_id' => ['required', 'exists:students,id'],
            'job' => ['required', 'string'],
            'nid' => ['required', 'string', 'regex:/^[0-9]{14}$/'],
        ];
    }
}
