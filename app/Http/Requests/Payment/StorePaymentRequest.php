<?php

namespace App\Http\Requests\Payment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'exists:academic_years,name'],
            'level' => ['required', 'string'],
            'type' => ['required', 'string'],
            'student_id' => ['required', 'numeric', 'exists:students,id'],
            'date' => ['required', 'date'],
            'value' => ['required', 'numeric', 'min:1'],
        ];
    }
}
