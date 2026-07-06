<?php

namespace App\Http\Controllers;

use App\Http\Requests\SecretAssignment\TriggerSecretAssignmentRequest;
use App\Http\Requests\SecretNumber\StoreSecretNumberRequest;
use App\Http\Requests\SecretNumber\UpdateSecretNumberRequest;
use App\Http\Resources\SecretNumberResource;
use App\Models\SecretNumber;
use App\Services\SecretAssignmentService;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SecretNumberController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'academic_year', 'language', 'semester',
    ];

    protected array $searchable = [
        'group_number',
    ];

    protected string $model = SecretNumber::class;

    protected string $storeRequest = StoreSecretNumberRequest::class;

    protected string $updateRequest = UpdateSecretNumberRequest::class;

    protected string $resource = SecretNumberResource::class;

    public function store(Request $request)
    {
        $validated = app($this->storeRequest)->validated();

        $record = new ($this->model)($validated);
        $record->save();

        $results = app(SecretAssignmentService::class)->assign(
            $validated['academic_year'],
            $validated['semester'],
            $validated['level'],
            (int) $validated['grade'],
            $validated['language'],
        );

        if (! empty($results['errors'])) {
            $record->delete();

            return response()->json([
                'message' => 'فشل توزيع الأرقام السرية: عدد الطلاب أكبر من المقاعد المتاحة',
                'errors' => $results['errors'],
            ], 422);
        }

        return new ($this->resource)($record);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        return response()->json([
            'message' => 'لا يمكن تعديل نطاق الأرقام السرية. قم بحذف النطاق وإضافته من جديد',
        ], 405);
    }

    public function assign(
        TriggerSecretAssignmentRequest $request,
        SecretAssignmentService $service,
    ): JsonResponse {
        $validated = $request->validated();

        $results = $service->assign(
            $validated['academic_year'],
            $validated['semester'] ?? null,
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
            'message' => 'تم توزيع الأرقام السرية بنجاح',
            'assigned' => $results['assigned'],
            'skipped' => $results['skipped'],
            'errors' => [],
        ]);
    }
}
