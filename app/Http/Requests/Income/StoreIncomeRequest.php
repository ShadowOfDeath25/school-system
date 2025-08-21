<?php

namespace App\Http\Requests\Income;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncomeRequest extends FormRequest
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
            "type" => [
                "required",
                "string",
                "max:255"
            ],
            "value" => [
                "required",
                "numeric",
                "decimal:10,2"
            ],
            "description" => [
                "string",
            ]
        ];
    }
}
