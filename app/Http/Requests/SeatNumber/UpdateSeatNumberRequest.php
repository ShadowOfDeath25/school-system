<?php

namespace App\Http\Requests\SeatNumber;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeatNumberRequest extends FormRequest
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
            'level' => ['string', 'max:255'],
            'grade' => ['string', 'max:255'],
            'starts_at' => ['date'],
            'ends_at' => ['date'],
        ];
    }
}
