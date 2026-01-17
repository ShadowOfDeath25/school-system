<?php

namespace App\Http\Controllers;

use App\Services\StudentReportsService;
use Symfony\Component\HttpFoundation\JsonResponse;

use Illuminate\Http\Request;

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
     * @param Request $request
     * @param StudentReportsService $studentReportsService
     * @return JsonResponse
     */
    public function arrearsReport(Request $request, StudentReportsService $studentReportsService): JsonResponse
    {

       return "TBD";
    }
}
