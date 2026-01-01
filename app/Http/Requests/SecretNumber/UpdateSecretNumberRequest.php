<?php

namespace App\Http\Requests\SecretNumber;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSecretNumberRequest extends FormRequest
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
            'grade' => ['integer'],
            'group_number' => ['numeric', 'max:255'],
            'group_capacity' => ['integer', 'max:255'],
            'academic_year' => ['exists:academic_years,name'],
            'language' => ['string', 'max:255', 'in:عربي,لغات'],
            'level' => ['string', 'max:255'],
            'starts_at' => ['numeric'],
            'ends_at' => ['numeric', 'gt:starts_at'],
            'semester' => ['string', 'in:الأول,الثاني,طوال العام']

        ];
    }
}
