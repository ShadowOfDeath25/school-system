<?php

namespace App\Http\Requests\Student;

use App\Rules\AgeForGrade;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_in_arabic' => ['required', 'string'],
            'name_in_english' => ['required', 'string'],
            'nid' => ['required', 'string', 'regex:/^[0-9]{14}$/', 'unique:students,nid'],
            'birth_date' => ['required', 'date', new AgeForGrade],
            'birth_address' => ['required', 'string'],
            'language' => ['required', 'string', 'in:عربي,لغات'],
            'status' => ['string', 'required'],
            'gender' => ['required', 'string', Rule::in(['female', 'male'])],
            'religion' => ['required', 'string', Rule::in(['مسيحي', 'مسلم'])],
            'nationality' => ['string', 'required'],
            'note' => ['nullable', 'string', Rule::exists('note_types', 'name')],
            'classroom_id' => ['numeric', 'exists:classrooms,id'],
            'grade' => ['numeric', 'required', 'min:1', 'max:11'],
            'level' => ['string', 'required', 'in:ابتدائي,اعدادي,رياض أطفال'],
            'parent_mode' => ['required', 'string', 'in:first,sibling,mixed'],
            'existing_nids' => ['required_if:parent_mode,mixed', 'array'],
            'existing_nids.*' => ['string', 'regex:/^[0-9]{14}$/'],
            'parents' => ['sometimes', 'array'],
            'parents.*.name' => ['required_if:parent_mode,first', 'string', 'max:255'],
            'parents.*.phone_number' => ['required_if:parent_mode,first', 'string', 'max:20', 'distinct'],
            'parents.*.job' => ['nullable', 'string', 'max:255'],
            'parents.*.edu' => ['nullable', 'string', 'max:255'],
            'parents.*.gender' => ['required', 'string', Rule::in(['male', 'female'])],
            'parents.*.nid' => ['required', 'string', 'regex:/^[0-9]{14}$/'],
            'guardian_type' => ['required', 'string', Rule::in(['father', 'mother', 'other'])],
            'guardian_relationship' => ['required_if:guardian_type,other', 'nullable', 'string', 'max:255'],
            'guardian_name' => ['required_if:guardian_type,other', 'nullable', 'string', 'max:255'],
            'guardian_nid' => ['required_if:guardian_type,other', 'nullable', 'string', 'regex:/^[0-9]{14}$/'],
            'guardian_phone_number' => ['required_if:guardian_type,other', 'nullable', 'string', 'regex:/^(?:\+20|0)?1[0125][0-9]{8}$/'],
            'guardian_job' => ['nullable', 'string', 'max:255'],
            'guardian_edu' => ['nullable', 'string', 'max:255'],
            'transferred_in' => ['sometimes', 'boolean'],
            'previous_school' => ['required_if:transferred_in,true', 'nullable', 'string', 'max:255'],
            'transfer_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
