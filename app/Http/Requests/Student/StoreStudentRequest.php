<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_in_arabic' => ['required', 'string'],
            'name_in_english' => ['required', 'string'],
            'nid' => ['required', 'string', 'regex:/^[0-9]{14}$/', 'unique:students,nid'],
            'birth_date' => ['required', 'date'],
            'birth_address' => ['required', 'string'],
            'language' => ['required', 'string', Rule::in(['عربي', 'لغات'])],
            'gender' => ['required', 'string', Rule::in(['female', 'male'])],
            'religion' => ['required', 'string', Rule::in(["مسيحي", 'مسلم'])],
            'nationality' => ["string", "required"],
            'classroom_id' => [ "numeric", "exists:classrooms,id"],
            'guardians' => ['sometimes', 'array'],
            'guardians.*.name' => ['required', 'string', 'max:255'],
            'guardians.*.nid' => ['required', 'string', 'regex:/^[0-9]{14}$/', 'distinct'],
            'guardians.*.phone_number' => ['required', 'string', 'max:20', 'distinct'],
            'guardians.*.job' => ['nullable', 'string', 'max:255'],
            'guardians.*.edu' => ['nullable', 'string', 'max:255'],
            'guardians.*.gender' => ['required', 'string', Rule::in(['male', 'female'])],
        ];
    }
}
