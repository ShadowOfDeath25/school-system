<?php

namespace App\Http\Requests\Subject;

use App\Enums\Grade;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subjects' => ['array', 'required'],
            'subjects.*.min_marks' => ['numeric', 'required'],
            'subjects.*.max_marks' => ['numeric', 'required', 'gt:subjects.*.min_marks'],
            'subjects.*.added_to_total' => ['boolean', 'required'],
            'subjects.*.added_to_report' => ['boolean', 'required'],
            'subjects.*.semester' => ['string', 'required', 'in:الاول,الثاني,طوال العام'],
        ];
    }

    protected function prepareForValidation()
    {
        if (!Grade::tryFrom($this->route('grade'))) {
            abort(404, "هذه السنة الدراسية غير موجودة");
        }


        return $this;
    }


}
