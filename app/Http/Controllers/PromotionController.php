<?php

namespace App\Http\Controllers;

use App\Http\Requests\Promotion\ExecutePromotionRequest;
use App\Http\Requests\Promotion\PreviewPromotionRequest;
use App\Http\Requests\Promotion\ResolveSupplementaryExamRequest;
use App\Http\Resources\PromotionBatchResource;
use App\Models\PromotionBatch;
use App\Models\Student;
use App\Services\Promotion\PromotionEngineService;
use App\Services\Promotion\RollbackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionController extends Controller
{
    public function __construct(
        private PromotionEngineService $engine,
        private RollbackService $rollback,
    ) {}

    public function preview(PreviewPromotionRequest $request): JsonResponse
    {
        $results = $this->engine->preview(
            $request->input('from_year'),
            (int) $request->input('grade'),
            $request->input('language'),
        );

        $breakdown = [
            'passed' => 0,
            'دور_ثاني_eligible' => 0,
            'repeat' => 0,
            'graduated' => 0,
            'total' => $results->count(),
        ];

        $students = $results->map(function ($result) use (&$breakdown) {
            $breakdown[$result['category']] = ($breakdown[$result['category']] ?? 0) + 1;

            return [
                'id' => $result['student']->id,
                'name' => $result['student']->name_in_arabic,
                'language' => $result['student']->language,
                'grade' => $result['student']->grade,
                'category' => $result['category'],
                'subjects' => $result['subjects']->map(fn ($s) => [
                    'subject_name' => $s['subject_name'],
                    'total_marks' => $s['total_marks'],
                    'min_marks' => $s['min_marks'],
                    'passed' => $s['passed'],
                ]),
            ];
        });

        return response()->json([
            'breakdown' => $breakdown,
            'students' => $students,
        ]);
    }

    public function execute(ExecutePromotionRequest $request): JsonResponse
    {
        $batch = $this->engine->execute(
            $request->input('from_academic_year'),
            (int) $request->input('grade'),
            $request->input('student_ids'),
            $request->user(),
        );

        return response()->json([
            'batch' => new PromotionBatchResource($batch->load('batchStudents.student')),
        ], 201);
    }

    public function resolveSupplementaryExam(ResolveSupplementaryExamRequest $request): JsonResponse
    {
        $batch = PromotionBatch::findOrFail($request->input('promotion_batch_id'));
        $student = Student::findOrFail($request->input('student_id'));

        $this->engine->resolveSecondRound(
            $batch,
            $student,
            $request->input('results'),
            $batch->to_academic_year,
        );

        return response()->json(['message' => 'تم تحديث نتيجة الدور الثاني بنجاح']);
    }

    public function rollback(PromotionBatch $batch, Request $request): JsonResponse
    {
        if ($batch->status === 'rolled_back') {
            return response()->json(['message' => 'هذه الدفعة تم التراجع عنها بالفعل'], 422);
        }

        $this->rollback->rollback($batch, $request->user());

        return response()->json(['message' => 'تم التراجع عن الترقية بنجاح']);
    }

    public function batches(Request $request): JsonResource
    {
        $query = PromotionBatch::withCount('batchStudents')->with('creator');

        if ($request->has('from_academic_year')) {
            $query->where('from_academic_year', $request->input('from_academic_year'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $batches = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 30));

        return PromotionBatchResource::collection($batches);
    }

    public function showBatch(PromotionBatch $batch): PromotionBatchResource
    {
        return new PromotionBatchResource(
            $batch->load(['batchStudents.student', 'creator', 'rollbacker'])
        );
    }
}
