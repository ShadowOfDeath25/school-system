<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;

class PreviewPromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_year' => ['required', 'string', 'exists:academic_years,name'],
            'grade' => ['required', 'integer', 'min:1', 'max:11'],
            'language' => ['nullable', 'string', 'in:عربي,لغات'],
        ];
    }
}
