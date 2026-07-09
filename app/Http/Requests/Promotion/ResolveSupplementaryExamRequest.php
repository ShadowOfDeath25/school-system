<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;

class ResolveSupplementaryExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'promotion_batch_id' => ['required', 'integer', 'exists:promotion_batches,id'],
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'results' => ['required', 'array', 'min:1'],
            'results.*.grade_subject_id' => ['required', 'integer', 'exists:grade_subject,id'],
            'results.*.passed' => ['required', 'boolean'],
        ];
    }
}
