<?php

namespace App\Http\Requests\ActivityLog;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ActivityLogIndexRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "start_date" => ["date", "date_format:Y-m-d"],
            "end_date" => ["date", "date_format:Y-m-d", 'after_or_equal:start_date'],
            "users" => ['array'],
            "users.*" => ['exists:users,id'],
        ];
    }
}
