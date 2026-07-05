<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeatAssignment\TriggerAssignmentRequest;
use App\Http\Requests\SeatNumber\StoreSeatNumberRequest;
use App\Http\Requests\SeatNumber\UpdateSeatNumberRequest;
use App\Http\Resources\SeatNumberResource;
use App\Http\Resources\StudentSeatAssignmentResource;
use App\Models\SeatNumber;
use App\Models\StudentSeatAssignment;
use App\Services\SeatAssignmentService;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeatNumberController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'academic_year', 'level', 'grade', 'language',
    ];

    protected array $searchable = [
        'grade', 'level',
    ];

    protected string $model = SeatNumber::class;

    protected string $storeRequest = StoreSeatNumberRequest::class;

    protected string $updateRequest = UpdateSeatNumberRequest::class;

    protected string $resource = SeatNumberResource::class;

    public function store(Request $request)
    {
        $validated = app($this->storeRequest)->validated();

        $record = new ($this->model)($validated);
        $record->save();

        $results = app(SeatAssignmentService::class)->assign(
            $validated['academic_year'],
            $validated['level'],
            (int) $validated['grade'],
            $validated['language'],
        );

        if (! empty($results['errors'])) {
            $record->delete();

            return response()->json([
                'message' => 'فشل توزيع أرقام الجلوس: عدد الطلاب أكبر من المقاعد المتاحة',
                'errors' => $results['errors'],
            ], 422);
        }

        return new ($this->resource)($record);
    }

    public function assign(
        TriggerAssignmentRequest $request,
        SeatAssignmentService $service,
    ): JsonResponse {
        $validated = $request->validated();

        $results = $service->assign(
            $validated['academic_year'],
            $validated['level'] ?? null,
            isset($validated['grade']) ? (int) $validated['grade'] : null,
            $validated['language'] ?? null,
        );

        if (! empty($results['errors'])) {
            return response()->json([
                'message' => 'تم التوزيع مع وجود أخطاء في بعض المجموعات',
                'assigned' => $results['assigned'],
                'skipped' => $results['skipped'],
                'errors' => $results['errors'],
            ], 422);
        }

        return response()->json([
            'message' => 'تم توزيع أرقام الجلوس بنجاح',
            'assigned' => $results['assigned'],
            'skipped' => $results['skipped'],
            'errors' => [],
        ]);
    }

    public function getAssignments(Request $request)
    {
        $query = StudentSeatAssignment::with(['student', 'seatNumberConfig']);

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->input('academic_year'));
        }
        if ($request->filled('level')) {
            $query->whereHas('seatNumberConfig', fn ($q) => $q->where('level', $request->input('level')));
        }
        if ($request->filled('grade')) {
            $query->whereHas('seatNumberConfig', fn ($q) => $q->where('grade', $request->input('grade')));
        }
        if ($request->filled('language')) {
            $query->whereHas('seatNumberConfig', fn ($q) => $q->where('language', $request->input('language')));
        }

        $perPage = $request->input('per_page', 30);

        $assignments = $query->orderBy('assigned_number')->paginate($perPage);

        return StudentSeatAssignmentResource::collection($assignments);
    }
}
