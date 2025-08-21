<?php

namespace App\Http\Requests\Class;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRequest extends FormRequest
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
            'language' => [ "string", "max:255"],
            'phase' => ["string", "max:255"],
            'edu_year' => ["integer"],
            'class_number' => [ "integer"],
            'actual_capacity' => ["integer"],
            'max_capacity' => ["integer"],
        ];
    }
}
