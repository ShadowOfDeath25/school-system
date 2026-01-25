<?php

namespace App\Http\Controllers;

use App\Enums\PaymentType;
use App\Http\Requests\StudentReports\StudentLetterRequest;
use App\Services\StudentReportsService;
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
        $classrooms = $service->getStudentsGroupedByClassrooms(
            ...$this->extractStudentFilters($request)
        );

        return response()->json($classrooms);
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
            'grade' => isset($validated['grade']) ? (int) $validated['grade'] : null,
            'classroom' => isset($validated['classroom']) ? (int) $validated['classroom'] : null,
            'min' => isset($validated['min']) ? (float) $validated['min'] : null,
            'sorting' => $validated['sorting'] ?? null,
            'type' => $validated['type'] ?? null,
        ];
    }
}
