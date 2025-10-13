<?php

namespace App\Http\Requests\BookPurchase;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookPurchaseRequest extends FormRequest
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
            'quantity' => ['required', 'integer'],
            'book_id' => ['required', 'exists:books,id'],
            'student_name' => ['required', 'string']
        ];
    }
}
