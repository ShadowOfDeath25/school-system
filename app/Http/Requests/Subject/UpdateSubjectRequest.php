<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubjectRequest extends FormRequest
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
            'name' => ['string', 'max:255'],
            'max_marks' => ['integer'],
            'min_marks' => ['integer'],
            'level' => ['string', 'max:50'],
            'semester' => ['string', 'max:50'],
            'language' => ['string', 'max:50'],
            'academic_year' => ['exists:academic_years,name'],
            'added_to_total' => ["integer",'min:0', 'max:1'],
            'added_to_report' => ["integer",'min:0', 'max:1'],
            'type' => ['string'],
            'grade' => ['integer']
        ];
    }
}
