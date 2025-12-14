<?php

namespace App\Http\Requests\Exemption;

use Illuminate\Foundation\Http\FormRequest;

class FilterExemptionRequest extends FormRequest
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
            'student_id' => ['exists:students,id', 'integer', 'sometimes'],
            'type' => ['sometimes', 'string', 'exists:exemptions,type']
        ];
    }
}
