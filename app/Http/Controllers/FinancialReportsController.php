<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\PaymentSummaryRequest;
use App\Services\SummaryService;
use Carbon\Carbon;
use Carbon\Month;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class FinancialReportsController extends Controller
{
    public function monthly(): JsonResponse
    {
        $service = new SummaryService;
        return response()->json($service->getMonthlySummary());
    }

    public function summary(PaymentSummaryRequest $request)
    {
        $data = $request->validated();
        $service = new SummaryService();
        $incomes = $service->getTotalIncome($data['start_date'], $data['end_date']);
        $expenses = $service->getTotalExpenses($data['start_date'], $data['end_date']);
        return response()->json(["incomes" => $incomes, "expenses" => $expenses]);
    }
}
