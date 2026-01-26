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

class StudentReportsController extends Controller
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
            ...$this->extractStudentFilters($request)
        );
        $pdf = Pdf::view("reports.layouts.base",
            [
                "letter" => $request->validated('letter'),
                $studentsByClassrooms
            ]
        );

        Storage::put($filePath, $pdf);

        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route("reports.preview", $uuid)
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
        ];
    }

    public function preview(string $uuid)
    {
        $file_path = storage_path("app/reports/$uuid.pdf");

        if (!file_exists($file_path)) {
            abort(404, "هذا التقرير غير موجود");
        }

        return response()->file($file_path, [
            'Content-Type' => "application/pdf",
            'Content-Disposition' => 'inline'
        ])->deleteFileAfterSend(true);
    }


}
