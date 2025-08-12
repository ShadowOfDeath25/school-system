<?php

namespace App\Http\Requests\Bus;

use Illuminate\Foundation\Http\FormRequest;

class StoreBusRequest extends FormRequest
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
            "route" => ["required"],
            "supervisor_name" => ["required", "string"],
            "driver_name" => ["required", "string"],
            'capacity' => ["integer", 'required'],
            'license_plate' => ["required", "unique:buses,license_plate"],
        ];
    }
}
