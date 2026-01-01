<?php

namespace App\Http\Requests\SeatNumber;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeatNumberRequest extends FormRequest
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
            'level' => ['string', 'max:255', 'in:ابتدائي,رياض اطفال,اعدادي'],
            'grade' => ['integer' ],
            'academic_year' => ['exists:academic_years,name'],
            'language' => ['string', 'max:255', 'in:عربي,لغات'],
            'starts_at' => ['numeric'],
            'ends_at' => ['numeric'],
        ];
    }
}
