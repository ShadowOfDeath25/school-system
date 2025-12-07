<?php

namespace App\Http\Requests\UniformPurchase;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUniformPurchaseRequest extends FormRequest
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
            'uniform_id' => ["exists:uniforms,id"],
            'student_id' => ["exists:students,id"],
            'quantity' => ['integer', 'min:1']
        ];
    }
}
