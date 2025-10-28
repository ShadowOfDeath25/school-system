<?php

namespace App\Http\Requests\PaymentValue;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentValueRequest extends FormRequest
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
            'academic_year' => ['required', 'regex:/^\d{4}\/\d{4}$/'],
            "level" => ['sometimes', 'string'],
            "language" => ['sometimes', 'string', 'in:لغات,عربي'],
            "grade" => ['sometimes', 'integer'],
            "value" => ['required', 'numeric'],
            'type' => ['string', 'required']
        ];
    }
}
