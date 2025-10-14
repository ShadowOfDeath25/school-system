<?php

namespace App\Http\Requests\Uniform;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUniformRequest extends FormRequest
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
            'type' => ["string"],
            'size' => ["string", 'in:xs,s,m,l,xl,xxl,xxxl'],
            'imported_quantity' => ['integer'],
            'available_quantity' => ['integer'],
            'price' => ['numeric']
        ];
    }
}
