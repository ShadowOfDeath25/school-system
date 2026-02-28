<?php

namespace App\Http\Requests\Student;

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
            'birth_date' => ['required', 'date'],
            'birth_address' => ['required', 'string'],
            'language' => ['required', 'string', 'in:عربي,لغات'],
            'status' => ['string', 'required'],
            'gender' => ['required', 'string', Rule::in(['female', 'male'])],
            'religion' => ['required', 'string', Rule::in(["مسيحي", 'مسلم'])],
            'nationality' => ["string", "required"],
            'note' => ['nullable', Rule::in(["ابناء عاملين", "توأم", "دمج", "يتيم", null])],
            'classroom_id' => ["numeric", "exists:classrooms,id"],
            'grade' => ["numeric", 'required', "min:1", "max:11"],
            'level' => ["string", 'required', "in:ابتدائي,اعدادي,رياض اطفال"],
            'guardians' => ['sometimes', 'array'],
            'guardians.*.name' => ['required', 'string', 'max:255'],
            'guardians.*.phone_number' => ['required', 'string', 'max:20', 'distinct'],
            'guardians.*.job' => ['nullable', 'string', 'max:255'],
            'guardians.*.edu' => ['nullable', 'string', 'max:255'],
            'guardians.*.gender' => ['required', 'string', Rule::in(['male', 'female'])],
        ];
    }
}
