<?php

namespace App\Http\Requests\Marks;

use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Student;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMarksRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('academic_year')) {
            $this->merge([
                'academic_year' => AcademicYear::activeCached()?->name,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'student_id' => ['exists:students,id'],
            'exam_id' => ['exists:exams,id'],
            'marks' => ['nullable', 'numeric', 'min:0'],
            'component_id' => ['string'],
            'academic_year' => ['string', 'exists:academic_years,name'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $componentId = $this->input('component_id', $this->route('mark')?->component_id);
            $studentId = $this->input('student_id', $this->route('mark')?->student_id);
            $examId = $this->input('exam_id', $this->route('mark')?->exam_id);

            if (! $componentId || ! $studentId || ! $examId) {
                return;
            }

            $student = Student::find($studentId);
            $exam = Exam::with('gradeSubject')->find($examId);

            if (! $student || ! $exam) {
                return;
            }

            if ($componentId !== $exam->component_id) {
                $validator->errors()->add('component_id', 'المكون المختار لا يتطابق مع مكون الامتحان.');

                return;
            }

            $gradeSubject = $exam->gradeSubject;
            $component = $gradeSubject?->component($componentId);

            if (! $component) {
                $validator->errors()->add('component_id', 'المكون المختار غير موجود لهذه المادة.');

                return;
            }

            if ($this->filled('marks') && (float) $this->marks > (float) ($component['marks'] ?? 0)) {
                $validator->errors()->add('marks', 'لا يمكن إدخال درجة أكبر من الدرجة الكلية للمكون.');

                return;
            }

            if ($student->grade != $exam->gradeSubject->grade_id || $student->language !== $exam->language) {
                $validator->errors()->add('exam_id', 'الامتحان المختار غير متاح لهذا الطالب.');
            }
        });
    }
}
