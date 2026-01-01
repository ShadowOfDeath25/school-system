<?php

namespace App\Http\Requests\SeatNumber;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeatNumberRequest extends FormRequest
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
            'level' => ['required', 'string', 'max:255', 'in:ابتدائي,رياض اطفال,اعدادي'],
            'grade' => ['required', 'integer', 'max:255'],
            'academic_year' => ['required', 'exists:academic_years,name'],
            'language' => ['required', 'string', 'max:255', 'in:عربي,لغات'],
            'starts_at' => ['required', 'numeric'],
            'ends_at' => ['required', 'numeric'],
        ];
    }
}
