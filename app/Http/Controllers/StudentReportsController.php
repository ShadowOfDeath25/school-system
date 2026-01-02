<?php

namespace App\Http\Controllers;

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
}
