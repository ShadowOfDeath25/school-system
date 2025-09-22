<?php

namespace App\Http\Requests\ExamHall;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamHallRequest extends FormRequest
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

            'language' => ['required', 'string', 'max:255'],
            'floor_id' => ['required', 'exists:floors,id'],
            'capacity' => ['required', 'string'],
            'grade' => ['required', 'string',],
            'level' => ['required', 'string'],
            'building_id' => ['required', 'exists:buildings,id'],
            'semester' => ['required', 'string'],
            'number' => ['required', 'string', ],
            'academic_year' => ['required', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date'],  

             
        ];
    }
}
