<?php

namespace App\Http\Requests\Student;

use App\Models\Exam;
use App\Models\Student;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentMarkRequest extends FormRequest
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
            'exam_id' => ['required', 'exists:exams,id'],
            'student_id' => ['required', 'exists:students,id'],
            'marks' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $student = Student::find($this->student_id);
            $exam = Exam::find($this->exam_id);

            if (!$student || !$exam) {
                return;
            }


            if ($student->grade_id !== $exam->grade_id || $student->language !== $exam->language) {
                $validator->errors()->add(
                    'exam_id',
                    'الامتحان المختار غير متاح لهذا الطالب'
                );
            }
        });
    }

}
