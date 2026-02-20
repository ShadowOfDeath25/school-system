<?php

namespace App\Http\Controllers;

use App\Enums\PaymentType;
use App\Http\Requests\StudentReports\StudentLetterRequest;
use App\Services\StudentReportsService;
use Illuminate\Http\Request;
use Spatie\LaravelPdf\Facades\Pdf;
use Storage;
use Str;
use Symfony\Component\HttpFoundation\JsonResponse;

class StudentReportController extends Controller
{
    /**
     * Get a summary of student data.
     *
     * @param StudentReportsService $studentReportsService
     * @return JsonResponse
     */
    public function summary(StudentReportsService $studentReportsService): JsonResponse
    {
        return response()->json($studentReportsService->getStudentSummary());
    }

    /**
     * Get arrears report data (optionally filtered by classroom).
     *
     * @param StudentLetterRequest $request
     * @param StudentReportsService $studentReportsService
     * @return JsonResponse
     */
    public function arrearsReport(StudentLetterRequest $request, StudentReportsService $studentReportsService): JsonResponse
    {
        $classrooms = $studentReportsService->getStudentsGroupedByClassrooms(
            ...$this->extractStudentFilters($request)
        );

        return response()->json($classrooms);
    }

    /**
     * Get student letters for students with outstanding payments.
     *
     * @param StudentLetterRequest $request
     * @param StudentReportsService $service
     * @return JsonResponse
     */
    public function studentLetters(StudentLetterRequest $request, StudentReportsService $service): JsonResponse
    {
        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";

        $studentsByClassrooms = $service->getStudentsGroupedByClassrooms(
            ...$this->extractStudentFilters($request),

        );

        $dir = storage_path('app/reports');

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        Pdf::view('reports.letters', [
            'letter' => $request->validated('letter'),
            'studentsByClassrooms' => $studentsByClassrooms,
        ])
            ->format('a4')
            ->margins(0, 0, 10, 0)
            ->footerView("components.pdf-footer")
            ->save(storage_path("app/$filePath"));


        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid),
        ]);
    }

    /**
     * Extract student filter parameters from the request.
     *
     * @param StudentLetterRequest $request
     * @return array
     */
    private function extractStudentFilters(StudentLetterRequest $request): array
    {
        $validated = $request->validated();

        return [
            'academicYear' => $validated['academic_year'] ?? null,
            'language' => $validated['language'] ?? null,
            'level' => $validated['level'] ?? null,
            'grade' => isset($validated['grade']) ? (int)$validated['grade'] : null,
            'classroom' => isset($validated['classroom']) ? (int)$validated['classroom'] : null,
            'min' => isset($validated['min']) ? (float)$validated['min'] : null,
            'sorting' => $validated['sorting'] ?? null,
            'type' => $validated['type'] ?? null,
            'per_chunk' => $validated['per_chunk'] ?? 15,
        ];
    }




}
