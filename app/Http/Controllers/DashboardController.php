<?php

namespace App\Http\Controllers;

use App\Services\StudentReportService;
use App\Services\SummaryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DashboardController extends Controller
{
    public function index(SummaryService $financialService, StudentReportService $studentsService): JsonResponse
    {
        return response()->json([
            'financial'=> $financialService->getMonthlySummary(),
            'students' => $studentsService->getStudentSummary()
        ]);

    }
}
