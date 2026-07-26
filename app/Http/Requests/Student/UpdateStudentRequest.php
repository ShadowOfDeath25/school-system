<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')->id;

        return [
            'name_in_arabic' => ['sometimes', 'string'],
            'name_in_english' => ['sometimes', 'string'],
            'nid' => ['sometimes', 'string', 'regex:/^[0-9]{14}$/', Rule::unique('students')->ignore($studentId)],
            'birth_date' => ['sometimes', 'date'],
            'birth_address' => ['sometimes', 'string'],
            'language' => ['string', 'in:عربي,لغات'],
            'gender' => ['sometimes', 'string', Rule::in(['female', 'male'])],
            'religion' => ['sometimes', 'string', Rule::in(['مسيحي', 'مسلم'])],
            'nationality' => ['sometimes', 'string'],
            'note' => ['sometimes', 'string', 'nullable', Rule::in(['لا يوجد', 'ابناء عاملين', 'توأم', 'دمج', 'يتيم'])],
            'status' => ['sometimes', 'string', Rule::in(['مستجد', 'باقي', 'تم سحب ملفه'])],
            'reg_number' => ['sometimes', 'string', 'numeric'],
            'withdrawn' => ['sometimes', 'boolean'],
            'classroom_id' => ['nullable', 'sometimes', 'numeric', 'exists:classrooms,id'],
            'grade' => ['numeric', 'min:1', 'max:11'],
            'level' => ['string', 'in:ابتدائي,اعدادي,رياض أطفال'],
            'parents' => ['sometimes', 'array'],
            'parents.*.name' => ['required', 'string', 'max:255'],
            'parents.*.phone_number' => ['required', 'string', 'max:20', 'distinct'],
            'parents.*.job' => ['nullable', 'string', 'max:255'],
            'parents.*.edu' => ['nullable', 'string', 'max:255'],
            'parents.*.gender' => ['required', 'string', Rule::in(['female', 'male'])],
            'parents.*.nid' => ['required', 'string', 'regex:/^[0-9]{14}$/'],
            'guardian_type' => ['sometimes', 'string', Rule::in(['father', 'mother', 'other'])],
            'guardian_relationship' => ['required_if:guardian_type,other', 'string', 'max:255'],
            'guardian_name' => ['required_if:guardian_type,other', 'string', 'max:255'],
            'guardian_nid' => ['required_if:guardian_type,other', 'string', 'regex:/^[0-9]{14}$/'],
            'guardian_phone_number' => ['required_if:guardian_type,other', 'string', 'regex:/^(?:\+20|0)?1[0125][0-9]{8}$/'],
            'guardian_job' => ['nullable', 'string', 'max:255'],
            'guardian_edu' => ['nullable', 'string', 'max:255'],
        ];
    }
}
