<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\PaymentSummaryRequest;
use App\Services\SummaryService;
use Carbon\Carbon;
use Carbon\Month;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\LaravelPdf\Facades\Pdf;
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

    public function printSummary(PaymentSummaryRequest $request, SummaryService $service)
    {
        $data = $request->validated();
        $uuid = Str::uuid()->toString();
        $incomes = $service->getTotalIncome($data["start_date"], $data['end_date']);
        $expenses = $service->getTotalExpenses($data['start_date'], $data['end_date']);
        $start_date = Carbon::parse($data["start_date"])->locale("ar")->translatedFormat('j F Y');
        $end_date = Carbon::parse($data["end_date"])->locale("ar")->translatedFormat('j F Y');
        $filePath = "reports/$uuid.pdf";
        $dir = storage_path('app/reports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        Pdf::view('reports.net_income',
            [
                "incomes" => $incomes,
                "expenses" => $expenses,
                "start_date" => $start_date,
                "end_date" => $end_date
            ])
            ->format('a4')
            ->margins(5, 5, 5, 5)
            ->footerView("components.pdf-footer")
            ->save(storage_path("app/$filePath"));

        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid),
        ]);
    }


}
