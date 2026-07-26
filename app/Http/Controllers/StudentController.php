<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\StudentTransfer;
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
    use HasCRUD;
    use HasFilters;

    protected string $model = Student::class;

    protected string $storeRequest = StoreStudentRequest::class;

    protected string $updateRequest = UpdateStudentRequest::class;

    protected string $resource = StudentResource::class;

    protected array $filterable = [
        'classroom', 'classroom.level', 'classroom.academic_year', 'classroom.grade', 'language',
    ];

    protected array $searchable = [
        'name_in_arabic', 'name_in_english', 'nid', 'reg_number',
    ];

    protected array $relationsToLoad = ['classroom', 'parents', 'guardian'];

    public function query()
    {
        $query = Student::query()->with($this->relationsToLoad);

        if (request()->has('withdrawn')) {
            $query->where('withdrawn', true);
        } elseif (! request()->has('includeWithdrawn')) {
            $query->where(function ($q) {
                $q->where('withdrawn', false)
                    ->orWhereNull('withdrawn');
            });
        }

        if (request()->has('transferred_out')) {
            $query->where('transferred_out', true);
        } elseif (! request()->has('includeTransferredOut')) {
            $query->where('transferred_out', false);
        }

        return $query;
    }

    public function show(Student $student)
    {
        return StudentResource::make($student->load($this->relationsToLoad));
    }

    public function store(StoreStudentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $parentData = Arr::pull($validated, 'parents', []);
        $parentMode = Arr::pull($validated, 'parent_mode', 'first');
        $existingNids = Arr::pull($validated, 'existing_nids', []);
        $guardianType = Arr::pull($validated, 'guardian_type', 'father');
        Arr::pull($validated, 'guardian_relationship');
        Arr::pull($validated, 'guardian_name');
        Arr::pull($validated, 'guardian_nid');
        Arr::pull($validated, 'guardian_phone_number');
        Arr::pull($validated, 'guardian_job');
        Arr::pull($validated, 'guardian_edu');
        $transferredIn = Arr::pull($validated, 'transferred_in', false);
        $previousSchool = Arr::pull($validated, 'previous_school');
        $transferNotes = Arr::pull($validated, 'transfer_notes');
        $studentData = $validated;

        if ($parentMode === 'sibling') {
            $nids = array_column($parentData, 'nid');
            $foundParents = Guardian::whereIn('nid', $nids)->get()->keyBy('nid');

            $existing = [];
            $missing = [];

            foreach ($parentData as $i => $parent) {
                if (isset($foundParents[$parent['nid']])) {
                    $g = $foundParents[$parent['nid']];
                    $existing[] = [
                        'nid' => $g->nid,
                        'name' => $g->name,
                        'gender' => $g->gender,
                        'index' => $i,
                    ];
                } else {
                    $missing[] = [
                        'nid' => $parent['nid'],
                        'gender' => $parent['gender'],
                        'index' => $i,
                    ];
                }
            }

            if (count($missing) === 2) {
                return response()->json([
                    'message' => 'لا يوجد سجلات للوالدين',
                    'parent_check' => ['case' => 'none_found'],
                ], 422);
            }

            if (count($missing) === 1) {
                $role = $missing[0]['gender'] === 'male' ? 'الأب' : 'الأم';
                $existingRole = $existing[0]['gender'] === 'male' ? 'الأب' : 'الأم';
                return response()->json([
                    'message' => "لم يتم العثور على ولي أمر $role. تم العثور على $existingRole: {$existing[0]['name']}. الرجاء إدخال بيانات $role",
                    'parent_check' => [
                        'case' => 'one_found',
                        'existing' => $existing,
                        'missing' => $missing,
                    ],
                ], 422);
            }
        }

        $student = DB::transaction(function () use ($studentData, $parentData, $parentMode, $existingNids, $guardianType, $transferredIn, $previousSchool, $transferNotes) {
            if (! empty($studentData['classroom_id'])) {
                $newClassroom = Classroom::withCount(['students' => function ($query) {
                    $query->where('withdrawn', false)
                        ->orWhereNull('withdrawn');
                }])->findOrFail($studentData['classroom_id']);

                if ($newClassroom->students_count >= $newClassroom->max_capacity) {
                    throw ValidationException::withMessages([
                        'classroom_id' => ['The selected classroom is full.'],
                    ]);
                }
            }

            $student = new Student($studentData);
            $student->save();

            $parentIds = [];
            foreach ($parentData as $parent) {
                if ($parentMode === 'mixed' && in_array($parent['nid'], $existingNids)) {
                    $existingParent = Guardian::where('nid', $parent['nid'])->firstOrFail();
                    $parentIds[] = $existingParent->id;
                } else {
                    $newOrFoundParent = Guardian::firstOrCreate(
                        ['nid' => $parent['nid']],
                        $parent
                    );
                    $parentIds[] = $newOrFoundParent->id;
                }
            }

            if (! empty($parentIds)) {
                $student->parents()->attach($parentIds);
                $guardianId = match ($guardianType) {
                    'father' => $parentIds[0] ?? null,
                    'mother' => $parentIds[1] ?? null,
                    'other' => $parentIds[2] ?? $parentIds[0],
                };
                $student->guardian_id = $guardianId;
                $student->save();
            }

            if ($transferredIn && $previousSchool) {
                $activeYear = AcademicYear::activeCached();
                StudentTransfer::create([
                    'student_id' => $student->id,
                    'direction' => 'incoming',
                    'other_school_name' => $previousSchool,
                    'notes' => $transferNotes,
                    'transfer_date' => now(),
                    'academic_year' => $activeYear?->name ?? now()->year,
                    'created_by' => request()->user()?->id,
                ]);
            }

            return $student;
        });

        return (new $this->resource($student->load($this->relationsToLoad)))->response()->setStatusCode(201);
    }

    public function update(UpdateStudentRequest $request, Student $student): StudentResource
    {

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
            $parentData = Arr::pull($validated, 'parents');
            $guardianType = Arr::pull($validated, 'guardian_type');
            $student->update($validated);
            if ($request->has('parents')) {
                $parentIds = collect($parentData)->map(function ($parent) {
                    if (empty($parent['nid'])) {
                        return null;
                    }

                    return Guardian::firstOrCreate(
                        ['nid' => $parent['nid']],
                        $parent
                    )->id;
                })->filter();
                $student->parents()->sync($parentIds);
                $guardianId = match ($guardianType ?? 'father') {
                    'father' => $parentIds->first(),
                    'mother' => $parentIds->count() > 1 ? $parentIds->values()->get(1) : $parentIds->first(),
                    'other' => $parentIds->last(),
                };
                $student->guardian_id = $guardianId;
                $student->save();
            }
        });

        return new $this->resource($student->load($this->relationsToLoad));
    }

    public function getPayments(Request $request, Student $student)
    {
        $request->validate([
            'academic_year' => ['required', 'exists:academic_years,name'],
            'student' => ['exists:students,id'],
        ]);
        $service = new StudentPaymentsService;

        return response()->json($service->getStudentPayments($student, $request->input('academic_year')));
    }

    public function requiredExams(Request $request, Student $student)
    {
        return $student->required_exams;
    }
}
