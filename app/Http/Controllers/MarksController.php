<?php

namespace App\Http\Controllers;

use App\Http\Requests\Marks\StoreMarksRequest;
use App\Http\Requests\Marks\UpdateMarksRequest;
use App\Http\Resources\MarksResource;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Marks;
use App\Models\Student;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;

class MarksController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'student_id',
        'exam_id',
        'component_id',
        'academic_year',
        'exam.component_id',
        'exam.gradeSubject.subject.name',
        'exam.language',
        'exam.semester',
    ];

    protected array $relationsToLoad = ['student', 'exam.gradeSubject.subject'];

    protected string $model = Marks::class;

    protected string $storeRequest = StoreMarksRequest::class;

    protected string $updateRequest = UpdateMarksRequest::class;

    protected string $resource = MarksResource::class;

    public function studentExams(Student $student): JsonResponse
    {
        $exams = Exam::with('gradeSubject.subject')
            ->whereHas('gradeSubject', function ($q) use ($student) {
                $q->where('grade_id', $student->grade)
                    ->where('language', $student->language);
            })
            ->get()
            ->map(function ($exam) use ($student) {
                $mark = $student->marks()->where('exam_id', $exam->id)->first();

                return [
                    'exam_id' => $exam->id,
                    'exam_name' => $exam->name,
                    'subject_name' => $exam->gradeSubject?->subject?->name,
                    'component_id' => $exam->component_id,
                    'component_name' => $exam->component['name'] ?? null,
                    'component_max_marks' => $exam->component['marks'] ?? null,
                    'marks_id' => $mark?->id,
                    'marks' => $mark?->marks,
                    'semester' => $exam->semester,
                    'type' => $exam->type,
                    'date' => $exam->date,
                ];
            });

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name_in_arabic' => $student->name_in_arabic,
                'reg_number' => $student->reg_number,
                'grade' => $student->grade,
                'grade_name' => Grade::find($student->grade)?->name,
                'level' => $student->level,
                'language' => $student->language,
            ],
            'exams' => $exams,
        ]);
    }
}
