<?php

namespace App\Http\Requests\Station;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStationRequest extends FormRequest
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
            'academic_year' => ['exists:academic_years,name'],
            'city' => ['string'],
            'neighborhood' => ['string'],
            'value' => ['numeric', 'sometimes']
        ];
    }
}
