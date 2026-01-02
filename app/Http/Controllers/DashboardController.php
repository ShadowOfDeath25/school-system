<?php

namespace App\Http\Controllers;

use App\Services\StudentReportsService;
use App\Services\SummaryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DashboardController extends Controller
{
    public function index(SummaryService $financialService, StudentReportsService $studentsService): JsonResponse
    {
        return response()->json([
            'financial'=> $financialService->getMonthlySummary(),
            'students' => $studentsService->getStudentSummary()
        ]);

    }
}
