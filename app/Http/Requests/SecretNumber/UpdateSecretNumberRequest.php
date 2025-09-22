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
            //
            'grade' => [ 'string', 'max:255'],
            'group_number' => [ 'string', 'max:255'],
            'group_capacity' => [ 'string', 'max:255'],
            'academic_year' => [ 'string', 'max:255'],
            'language' => [ 'string', 'max:255'],
            'level' => [ 'string', 'max:255'],
            'starts_at' => [ 'date'],
            'ends_at' => [ 'date'],
            
        ];
    }
}
