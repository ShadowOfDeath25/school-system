<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use App\Services\StudentPaymentsService;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    use HasCRUD {
        index as baseIndex;
    }
    use HasFilters;

    protected string $model = Student::class;
    protected string $storeRequest = StoreStudentRequest::class;
    protected string $updateRequest = UpdateStudentRequest::class;
    protected string $resource = StudentResource::class;
    protected array $filterable = [
        'classroom', 'classroom.level', 'classroom.academic_year', 'classroom.grade'
    ];
    protected array $searchable = [
        'name_in_arabic', 'name_in_english'
    ];
    protected array $relationsToLoad = ['classroom', 'guardians'];

    public function index(Request $request)
    {
        if ($request->has('withdrawn')) {
            return StudentResource::collection(
                Student::query()
                    ->with($this->relationsToLoad)
                    ->where('withdrawn', true)
                    ->paginate($request->input('per_page', 30))
                    ->withQueryString()
            );
        }
        if ($request->has('includeWithdrawn')){
            return StudentResource::collection(
                Student::query()
                    ->with($this->relationsToLoad)
                    ->paginate($request->input('per_page', 30))
                    ->withQueryString()
            );
        }
        return $this->baseIndex($request);
    }

    public function query()
    {
        return Student::query()
            ->with($this->relationsToLoad)
            ->where(function ($q) {
                $q->where('withdrawn', false)
                    ->orWhereNull('withdrawn');
            });
    }

    public function show(Student $student)
    {
        return $student->load($this->relationsToLoad);
    }

    public function store(StoreStudentRequest $request): JsonResponse
    {
        $this->authorizeAction("create");
        $validated = $request->validated();

        $guardianData = Arr::pull($validated, 'guardians', []);
        $studentData = $validated;

        $student = DB::transaction(function () use ($studentData, $guardianData) {
            $student = new Student($studentData);
            $student->save();

            $guardianIds = [];
            foreach ($guardianData as $guardian) {
                $newOrFoundGuardian = Guardian::firstOrCreate(
                    ['phone_number' => $guardian['phone_number']],
                    $guardian
                );
                $guardianIds[] = $newOrFoundGuardian->id;
            }

            if (!empty($guardianIds)) {
                $student->guardians()->attach($guardianIds);
            }

            return $student;
        });


        return (new $this->resource($student->load($this->relationsToLoad)))->response()->setStatusCode(201);
    }

    public function update(UpdateStudentRequest $request, Student $student): StudentResource
    {
        $this->authorizeAction("update");

        $validated = $request->validated();

        DB::transaction(function () use ($student, $validated, $request) {

            if ($request->has('classroom_id')) {
                $newClassroomId = $validated['classroom_id'] ?? null;
                $oldClassroomId = $student->classroom_id;
                if ($newClassroomId !== $oldClassroomId && $newClassroomId) {
                    $newClassroom = Classroom::withCount(['students' => function ($query) {
                        $query->where('withdrawn', false)
                            ->orWhereNull('withdrawn');
                    }])
                        ->findOrFail($newClassroomId);
                    if ($newClassroom->students_count >= $newClassroom->max_capacity) {
                        throw ValidationException::withMessages([
                            'classroom_id' => ['The selected classroom is full.'],
                        ]);
                    }
                }
            }
            $guardianData = Arr::pull($validated, 'guardians');
            $student->update($validated);
            if ($request->has('guardians')) {
                $guardianIds = collect($guardianData)->map(function ($guardian) {
                    if (empty($guardian['phone_number'])) {
                        return null;
                    }
                    return Guardian::firstOrCreate(
                        ['phone_number' => $guardian['phone_number']],
                        $guardian
                    )->id;
                })->filter();
                $student->guardians()->sync($guardianIds);
            }
        });


        return new $this->resource($student->load($this->relationsToLoad));
    }

    public function getPayments(Request $request, Student $student)
    {
        $request->validate([
            'academic_year' => ['required', 'regex:/^\d{4}\/\d{4}$/'],
            'student' => ['exists:students,id']
        ]);
        $service = new StudentPaymentsService;
        return response()->json($service->getStudentPayments($student, $request->input('academic_year')));
    }

}
