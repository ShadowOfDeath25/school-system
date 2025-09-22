<?php

namespace App\Http\Requests\BankAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBankAccountRequest extends FormRequest
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
            'document_number' => [ 'string', 'max:255'],
            'notes' => [ 'string'],
            'type' => [ 'string', 'max:255'],
            'manager_name' => ['string', 'max:255'],
            'academic_year' => [ 'string', 'max:255'],
            'value' => ['numeric'],
            'date' => [ 'date'],
        ];
    }
}
