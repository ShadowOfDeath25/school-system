<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
            'academic_year' => ["required", 'regex:/^\d{4}\/\d{4}$/'],
            'imported_quantity' => ["required", "integer"],
            'available_quantity' => ["required", "integer"],
            'semester' => ["required", "string"],
            'price' => ["decimal:2", "required"],
            'level' => ["string", "required",],
            'subject_id' => ["required", "integer", "exists:subjects,id"],
            'year' => ["required", "integer", "min:1900"],
        ];
    }
}
