<?php

namespace App\Http\Requests\Subject;

use App\Services\GradingComponentService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssignSubjectsToGradeRequest extends FormRequest
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
            'subject_id' => ['required', 'exists:subjects,id'],
            'min_marks' => ['numeric', 'required', 'min:0'],
            'components' => ['required', 'array', 'min:1'],
            'components.*.id' => ['nullable', 'string', 'max:255'],
            'components.*.name' => ['required', 'string', 'max:255'],
            'components.*.marks' => ['required', 'numeric', 'gt:0'],
            'components.*.is_final_exam' => ['required', 'boolean'],
            'components.*.is_monthly_exam' => ['nullable', 'boolean'],
            'use_monthly_median' => ['nullable', 'boolean'],
            'added_to_total' => ['boolean'],
            'added_to_report' => ['boolean'],
            'semester' => ['string', 'required', 'in:الاول,الثاني,طوال العام'],
            'language' => ['string', 'required', 'in:عربي,لغات'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $components = $this->input('components', []);
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
