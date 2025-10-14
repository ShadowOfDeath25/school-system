<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
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
            'academic_year' => ['regex:/^\d{4}\/\d{4}$/'],
            'imported_quantity' => ["integer"],
            'available_quantity' => ["integer"],
            'semester' => ["string"],
            'price' => ["numeric"],
            'level' => ["string"],
            'subject_id' => ["sometimes", "integer", "exists:subjects,id"],
            'grade' => ["integer"],
            'type' => ["string", 'unique:books,type'],
            'language' => ['string', 'in:لغات,عربي']
        ];
    }
}
