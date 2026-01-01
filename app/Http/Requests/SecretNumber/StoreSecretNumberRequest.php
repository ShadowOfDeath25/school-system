<?php

namespace App\Http\Requests\SecretNumber;

use Illuminate\Foundation\Http\FormRequest;

class StoreSecretNumberRequest extends FormRequest
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
            'grade' => ['required', 'integer'],
            'group_number' => ['numeric', 'max:255'],
            'group_capacity' => ['required', 'integer', 'max:255'],
            'academic_year' => ['required', 'exists:academic_years,name'],
            'language' => ['required', 'string', 'max:255', 'in:عربي,لغات'],
            'level' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'numeric'],
            'ends_at' => ['required', 'numeric', 'gt:starts_at'],
            'semester' => ['required', 'string', 'in:الاول,الثاني,طوال العام']
        ];
    }
}
