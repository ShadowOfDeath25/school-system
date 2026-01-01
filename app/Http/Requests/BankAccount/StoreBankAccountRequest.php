<?php

namespace App\Http\Requests\BankAccount;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankAccountRequest extends FormRequest
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
            'notes' => ['required', 'string'],
            'type' => ['required', 'string', 'max:255'],
            'manager_name' => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'exists:academic_years,name'],
            'value' => ['required', 'numeric'],
            'date' => ['required', 'date'],
        ];
    }
}
