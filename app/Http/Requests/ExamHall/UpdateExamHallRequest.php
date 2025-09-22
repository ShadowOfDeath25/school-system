<?php

namespace App\Http\Requests\ExamHall;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamHallRequest extends FormRequest
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
            //
            'language' => ['string', 'max:255'],
            'floor_id' => ['exists:floors,id'],
            'capacity' => ['string'],
            'grade' => ['string',],
            'level' => ['string'],
            'building_id' => ['exists:buildings,id'],
            'semester' => ['string'],
            'number' => ['string', ],
            'academic_year' => ['string'],
            'starts_at' => ['date'],
            'ends_at' => ['date'],
            
        ];
    }
}
