<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceResponse;
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
        'classroom', 'level'
    ];
    protected array $relationsToLoad = ['classroom', 'guardians'];




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
                    $newClassroom = Classroom::withCount('students')->findOrFail($newClassroomId);
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

}
