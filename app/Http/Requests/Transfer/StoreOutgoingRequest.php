<?php

namespace App\Http\Requests\Transfer;

use Illuminate\Foundation\Http\FormRequest;

class StoreOutgoingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'other_school_name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'يجب اختيار الطالب',
            'student_id.exists' => 'الطالب غير موجود',
            'other_school_name.required' => 'اسم المدرسة المطلوب التحويل إليها مطلوب',
            'other_school_name.max' => 'اسم المدرسة يجب ألا يتجاوز 255 حرف',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 1000 حرف',
        ];
    }
}
