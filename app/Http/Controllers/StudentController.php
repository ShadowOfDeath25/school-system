<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthorizationException;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Guardian;
use App\Models\Student;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Student::class;
    protected string $storeRequest = StoreStudentRequest::class;
    protected string $updateRequest = UpdateStudentRequest::class;
    protected string $resource = StudentResource::class;
    protected array $filterable = [

    ];

    /**
     * @throws \Throwable
     * @throws AuthorizationException
     */
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

        return response()->json($student->load('guardians'), 201);
    }

    public function update(UpdateStudentRequest $request, Student $student): JsonResponse
    {
        $this->authorizeAction("update");

        $validated = $request->validated();
        $guardianData = Arr::pull($validated, 'guardians');
        $studentData = $validated;

        DB::transaction(function () use ($student, $studentData, $guardianData, $request) {
            $student->update($studentData);

            if ($request->has('guardians')) {
                $guardianIds = collect($guardianData)->map(fn($guardian) => Guardian::firstOrCreate(['nid' => $guardian['nid']], $guardian)->id);
                $student->guardians()->sync($guardianIds);
            }
        });

        return response()->json($student->load('guardians'));
    }
}
