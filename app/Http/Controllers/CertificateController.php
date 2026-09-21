<?php

namespace App\Http\Controllers;

use App\Models\GradeSubject;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CertificateController extends Controller
{
    public function __construct(
        private CertificateService $certificateService,
    ) {}

    public function components(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'grade' => 'required|integer',
            'language' => 'nullable|string',
        ]);

        $grade = $request->input('grade');
        $language = $request->input('language');

        $query = GradeSubject::whereHas('grade', function ($q) use ($grade) {
            $q->where('grade', $grade);
        });

        if ($language) {
            $query->whereHas('grade', function ($q) use ($language) {
                $q->where('language', $language);
            });
        }

        $gradeSubjects = $query->get();

        $components = $gradeSubjects->flatMap(function ($gs) {
            return collect($gs->components ?? [])->pluck('name');
        })->unique()->filter()->values()->all();

        return response()->json($components);
    }

    public function print(Request $request): JsonResponse|BinaryFileResponse
    {
        $validated = $request->validate([
            'academic_year' => 'nullable|string',
            'promotion_batch_id' => 'nullable|integer|exists:promotion_batches,id',
            'student_id' => 'nullable|integer|exists:students,id',
            'grade' => 'nullable|integer',
            'language' => 'nullable|string',
            'level' => 'nullable|string',
            'classroom_id' => 'nullable|integer|exists:classrooms,id',
            'semester' => 'nullable|string|in:both,الأول,الثاني',
            'color_mode' => 'nullable|string|in:colors,color_names,color_only',
            'component_name' => 'nullable|string',
        ]);

        if (!$request->input('promotion_batch_id') && !$request->input('academic_year')) {
            return response()->json(['message' => 'يجب تحديد العام الدراسي أو دفعة الترقية'], 422);
        }

        $data = $this->certificateService->getCertificatesData($request->only([
            'academic_year', 'promotion_batch_id', 'student_id', 'grade', 'language', 'level', 'classroom_id', 'semester', 'component_name',
        ]));

        $data['semester'] = $request->input('semester', 'both');
        $data['color_mode'] = $validated['color_mode'] ?? 'colors';
        $data['component_name'] = $request->input('component_name');

        if (empty($data['students'])) {
            return response()->json(['message' => 'لا توجد بيانات للشهادات'], 404);
        }

        if ($request->query('export') === 'pdf') {
            ['uuid' => $uuid, 'filePath' => $filePath] = generateReportUUID();

            Pdf::view('reports.certificate', $data)
                ->format(Format::A4)
                ->orientation(Orientation::Portrait)
                ->margins(5, 5, 5, 5)
                ->save(storage_path("app/$filePath"));

            return response()->json([
                'uuid' => $uuid,
                'preview_url' => route('reports.preview', $uuid, true),
            ]);
        }

        return response()->json($data);
    }
}
