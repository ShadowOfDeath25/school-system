<?php

namespace App\Http\Requests\Expenses;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpensesRequest extends FormRequest
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
            'description' => ['required', 'string'],
            'value' => ['required', 'numeric'],
            'date' => ['required', 'date'],
            'academic_year' => ['required', 'regex:/^\d{4}\/\d{4}$/'],
            'type' => ['required', 'exists:expense_types,name']
        ];
    }
}
