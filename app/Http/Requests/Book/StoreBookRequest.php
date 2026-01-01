<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookRequest extends FormRequest
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
            'academic_year' => ["required", 'exists:academic_years,name'],
            'imported_quantity' => ["required", "integer", "min:1"],
            'available_quantity' => ["required", "integer", "lte:imported_quantity", "min:1"],
            'semester' => ["required", "string"],
            'price' => ["numeric", "required"],
            'buy_price' => ["numeric", "required"],
            'level' => ["string", "required",],
            'subject_id' => ["sometimes", "integer", "exists:subjects,id"],
            'grade' => ["required", "integer"],
            'type' => ["string", 'required', Rule::unique('books', 'type')->where('academic_year', $this->academic_year)],
            'language' => ['required', 'string', 'in:لغات,عربي']
        ];
    }
}
