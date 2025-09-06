<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')->id;

        return [
            'name_in_arabic' => ['sometimes', 'string'],
            'name_in_english' => ['sometimes', 'string'],
            'nid' => ['sometimes', 'string', 'regex:/^[0-9]{14}$/', Rule::unique('students')->ignore($studentId)],
            'birth_date' => ['sometimes', 'date'],
            'birth_address' => ['sometimes', 'string'],
            'language' => ['sometimes', 'string', Rule::in(['عربي', 'لغات'])],
            'gender' => ['sometimes', 'string', Rule::in(['female', 'male'])],
            'religion' => ['sometimes', 'string', Rule::in(["مسيحي", 'مسلم'])],
            'nationality' => ['sometimes', "string"],
            'classroom_id' => ['sometimes', "numeric", "exists:classrooms,id"],
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
