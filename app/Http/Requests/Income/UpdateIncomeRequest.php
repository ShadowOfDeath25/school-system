<?php

namespace App\Http\Requests\Income;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncomeRequest extends FormRequest
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
            "type" => ["string", 'exists:income_types,name', "max:255"],
            "value" => ["numeric"],
            "description" => ["string"],
            "date" => ['date'],
            "academic_year" => ['string', "regex:/^\d{4}\/\d{4}$/"]
        ];
    }
}
