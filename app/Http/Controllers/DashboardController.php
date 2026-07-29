<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Services\StudentReportService;
use App\Services\SummaryService;
use Symfony\Component\HttpFoundation\JsonResponse;

class DashboardController extends Controller
{
    public function index(SummaryService $financialService, StudentReportService $studentsService): JsonResponse
    {
        $academicYear = AcademicYear::activeCached()?->name;

        return response()->json([
            'financial' => $financialService->getMonthlySummary($academicYear),
            'students' => $studentsService->getStudentSummary($academicYear),
        ]);

    }
}
