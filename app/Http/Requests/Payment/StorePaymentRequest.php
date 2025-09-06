<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
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
            'academic_year' => ["required", 'regex:/^\d{4}\/\d{4}$/'],
            'level' => ['required', 'string'],
            'language' => ["required", "string", Rule::in(["لغات", "عربي"])],
            'type' => ["required", "string"],
            'student_id' => ["required", "numeric", "exists:students,id"],
            'value' => ["required", "decimal:2"]
        ];
    }
}
