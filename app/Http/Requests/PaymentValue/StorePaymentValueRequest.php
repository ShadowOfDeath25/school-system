<?php

namespace App\Http\Requests\PaymentValue;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'academic_year' => ['required', 'exists:academic_years,name'],
            'level' => ['sometimes', 'string'],
            'language' => ['sometimes', 'string', 'in:لغات,عربي'],
            'grade' => ['sometimes', 'integer'],
            'value' => ['required', 'numeric'],
            'type' => ['string', 'required'],
        ];
    }
}
