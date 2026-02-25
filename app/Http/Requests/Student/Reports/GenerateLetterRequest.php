<?php

namespace App\Http\Requests\Student\Reports;

use App\Traits\Requests\HasReportFilters;
use Illuminate\Foundation\Http\FormRequest;

class GenerateLetterRequest extends FormRequest
{
    use HasReportFilters;

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
            ...$this->baseReportFilters(),
            'letter' => ['required', 'string']
        ];
    }

    protected function passedValidation(): void
    {
        $this->replace([
            ...$this->validated(),
            'min' => (float)$this->validated('min')
        ]);

    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'academic_year' => 'السنة الدراسية',
            'language' => 'اللغة',
            'level' => 'المرحلة',
            'grade' => 'الصف',
            'classroom' => 'الفصل',
            'min' => 'الحد الأدنى للمستحقات',
            'sorting' => 'الترتيب',
            'type' => 'نوع الدفع',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'classroom.exists' => 'الفصل المحدد غير موجود',
            'grade.min' => 'الصف يجب أن يكون على الأقل 1',
            'grade.max' => 'الصف يجب ألا يتجاوز 12',
            'min.min' => 'الحد الأدنى للمستحقات يجب أن يكون 0 أو أكثر',
            'language.in' => 'اللغة يجب أن تكون عربي أو لغات',
            'level.in' => 'المرحلة يجب أن تكون ابتدائي أو اعدادي أو ثانوي',
            'sorting.in' => 'الترتيب يجب أن يكون maleFirst أو femaleFirst',
        ];
    }
}
