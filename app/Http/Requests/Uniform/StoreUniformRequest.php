<?php

namespace App\Http\Requests\Uniform;

use Illuminate\Foundation\Http\FormRequest;

class StoreUniformRequest extends FormRequest
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
            'type' => ['required', "string"],
            'size' => ['required', "string"],
            'academic_year' => ['required', 'string', 'regex:/^\d{4}\/\d{4}$/'],
            'imported_quantity' => ['required', 'integer'],
            'available_quantity' => ['required', 'integer', "lte:imported_quantity", "min:1"],
            'buy_price' => ['required', 'numeric'],
            'sell_price' => ['required', 'numeric'],
            'piece' => ['required', 'string']
        ];
    }
}
