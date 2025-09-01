<?php

namespace App\Http\Requests\Classroom;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassroomRequest extends FormRequest
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
            'language' => ["required", "string", "max:255"],
            'phase' => ["required", "string", "max:255"],
            'edu_year' => ["required", "integer"] ,
            'class_number' => ["required", "integer"],
            'actual_capacity' => ["required", "integer"],
            'max_capacity' => ["required", "integer"],

        ];
    }
}
