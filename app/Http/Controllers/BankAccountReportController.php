<?php

namespace App\Http\Controllers;

use App\Exports\BankAccountReportExport;
use App\Http\Requests\BankAccount\BankAccountReportRequest;
use App\Services\BankAccountReportService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BankAccountReportController extends Controller
{
    public function __invoke(
        BankAccountReportRequest $request,
        BankAccountReportService $reportService,
    ): JsonResponse|BinaryFileResponse {
        $validated = $request->validated();
        $data = $reportService->getReportData(
            academicYear: $validated['academic_year'],
            startDate: $validated['start_date'] ?? null,
            endDate: $validated['end_date'] ?? null,
        );

        $data['formatted_start_date'] = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->format('d/m/Y')
            : null;
        $data['formatted_end_date'] = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->format('d/m/Y')
            : null;

        if (($validated['export'] ?? null) === 'pdf') {
            ['uuid' => $uuid, 'filePath' => $filePath] = generateReportUUID();

            Pdf::view('reports.bank_accounts', $data)
                ->format('a4')
                ->orientation(Orientation::Landscape)
                ->footerView('components.pdf-footer')
                ->margins(10, 5, 10, 5)
                ->save(storage_path("app/$filePath"));

            return response()->json([
                'uuid' => $uuid,
                'preview_url' => route('reports.preview', $uuid, true),
            ]);
        }

        if (($validated['export'] ?? null) === 'excel') {
            return Excel::download(
                new BankAccountReportExport($data),
                'bank_account_transactions.xlsx',
            );
        }

        return response()->json($data);
    }
}
