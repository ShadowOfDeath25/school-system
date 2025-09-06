<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
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
            'name_in_arabic' => ['required', 'string'],
            'name_in_english' => ['required', 'string'],
            'nid' => ['required', 'string', 'regex:/^[0-9]{14}$/'],
            'birth_date' => ['required', 'date'],
            'birth_address' => ['required', 'string'],
            'language' => ['required', 'string', Rule::in(['عربي', 'لغات'])],
            'gender' => ['required', 'string', Rule::in(['female', 'male'])],
            'religion' => ['required', 'string', Rule::in(["مسيحي", 'مسلم'])],
            'nationality' => ["string", "required"],
            'class_id' => ['required', "numeric", "exists:classes,id"],
        ];
    }
}
