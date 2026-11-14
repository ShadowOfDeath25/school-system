<?php

namespace App\Http\Requests\Subject;

use App\Services\GradingComponentService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeSubjectsRequest extends FormRequest
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
            'min_marks' => ['numeric', 'min:0'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'components' => ['array', 'min:1'],
            'components.*.id' => ['nullable', 'string', 'max:255'],
            'components.*.name' => ['required_with:components', 'string', 'max:255'],
            'components.*.marks' => ['required_with:components', 'numeric', 'gt:0'],
            'components.*.is_final_exam' => ['required_with:components', 'boolean'],
            'components.*.is_monthly_exam' => ['nullable', 'boolean'],
            'use_monthly_median' => ['nullable', 'boolean'],
            'added_to_total' => ['boolean'],
            'added_to_report' => ['boolean'],
            'semester' => ['string', 'in:الاول,الثاني,طوال العام'],
            'language' => ['string', 'in:عربي,لغات'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $components = $this->input('components', []);

            if (! $this->filled('min_marks') || empty($components)) {
                return;
            }

            $useMedian = filter_var($this->input('use_monthly_median', false), FILTER_VALIDATE_BOOLEAN);
            $totalMarks = app(GradingComponentService::class)->totalMarks($components, $useMedian, $this->semester);

            if ((float) $this->min_marks > $totalMarks) {
                $validator->errors()->add(
                    'min_marks',
                    'الحد الأدنى للدرجات لا يمكن أن يكون أكبر من مجموع درجات المكونات.'
                );
            }
        });
    }
}