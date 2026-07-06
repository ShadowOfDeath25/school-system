<?php

namespace App\Http\Controllers;

use App\Http\Requests\Marks\StoreMarksRequest;
use App\Http\Requests\Marks\UpdateMarksRequest;
use App\Http\Resources\MarksResource;
use App\Http\Resources\SecretAssignmentListResource;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Marks;
use App\Models\Student;
use App\Models\StudentSecretAssignment;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
                'grade' => $student->grade,
                'grade_name' => Grade::find($student->grade)?->name,
                'level' => $student->level,
                'language' => $student->language,
                'secret_number' => StudentSecretAssignment::where('student_id', $student->id)
                    ->where('academic_year', AcademicYear::activeCached()?->name)
                    ->value('assigned_number'),
            ],
            'exams' => $exams,
        ]);
    }

    public function allSecretAssignments(Request $request)
    {
        $academicYear = $request->input('academic_year', AcademicYear::activeCached()?->name);

        $assignments = StudentSecretAssignment::where('academic_year', $academicYear);

        if ($request->filled('search')) {
            $assignments->where('assigned_number', 'like', '%'.$request->input('search').'%');
        }

        $assignments = $assignments->orderBy('assigned_number')
            ->paginate($request->input('per_page', 30));

        return SecretAssignmentListResource::collection($assignments);
    }

    public function secretAssignmentFilters(): JsonResponse
    {
        $years = StudentSecretAssignment::distinct()
            ->orderBy('academic_year')
            ->pluck('academic_year');

        return response()->json([
            'academic_year' => $years,
        ]);
    }
}
