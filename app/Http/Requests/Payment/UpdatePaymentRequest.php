<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
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
            'academic_year' => ['exists:academic_years,name'],
            'level' => ['string'],
            'type' => ["string"],
            'student_id' => ["numeric", "exists:students,id"],
            'date' => ["date"],
            'value' => ["numeric"]
        ];
    }
}
