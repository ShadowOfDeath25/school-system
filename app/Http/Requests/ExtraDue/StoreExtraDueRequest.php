<?php

namespace App\Http\Requests\ExtraDue;

use Illuminate\Foundation\Http\FormRequest;

class StoreExtraDueRequest extends FormRequest
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
            'student_id' => ['numeric', 'exists:students,id', 'required'],
            'note' => ['string', 'max:255'],
            'value' => ['numeric', 'required'],
            'academic_year' => ['required', 'string', 'exists:academic_years,name']
        ];
    }
}
