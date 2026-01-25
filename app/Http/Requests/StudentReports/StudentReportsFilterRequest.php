<?php

namespace App\Http\Requests\StudentReports;

use App\Enums\PaymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentReportsFilterRequest extends FormRequest
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
            'academic_year' => ['nullable', 'string', 'max:255'],
            'language' => ['nullable', 'string', Rule::in(['عربي', 'لغات'])],
            'level' => ['nullable', 'string', Rule::in(['ابتدائي', 'اعدادي', 'ثانوي'])],
            'grade' => ['nullable', 'integer', 'min:1', 'max:12'],
            'classroom' => ['nullable', 'integer', 'exists:classrooms,id'],
            'min' => ['nullable', 'numeric', 'min:0'],
            'sorting' => ['nullable', 'string', Rule::in(['maleFirst', 'femaleFirst'])],
            'type' => ['nullable', 'string', Rule::in([
                PaymentType::ADMINISTRATIVE->value,
                PaymentType::TUITION->value,
                PaymentType::UNIFORM->value,
                PaymentType::BOOK->value,
                PaymentType::ADDITIONAL->value,
                PaymentType::WITHDRAWAL->value,
            ])],
        ];
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
