<?php

namespace App\Http\Controllers;

use App\Enums\PaymentType;
use App\Exports\ArrearsExport;
use App\Exports\ArrearsGroupedExport;
use App\Exports\DailyPaymentsExport;
use App\Exports\LettersExport;
use App\Http\Requests\Student\Reports\GenerateArrearsReportRequest;
use App\Http\Requests\Student\Reports\GenerateDailyPaymentsReportRequest;
use App\Http\Requests\Student\Reports\GenerateLetterRequest;
use App\Models\Payment;
use App\Models\Student;
use App\Services\StudentReportService;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

class StudentReportController extends Controller
{
    /**
     * Get a summary of student data.
     *
     * @param StudentReportService $studentReportsService
     * @return JsonResponse
     */
    public function summary(StudentReportService $studentReportsService): JsonResponse
    {
        return response()->json($studentReportsService->getStudentSummary());
    }

    /**
     * Get arrears report data (optionally filtered by classroom).
     *
     * @param GenerateArrearsReportRequest $request
     * @param StudentReportService $studentReportsService
     * @return JsonResponse
     */
    public function arrearsReport(GenerateArrearsReportRequest $request, StudentReportService $studentReportsService): JsonResponse|BinaryFileResponse
    {
        $filters = $this->extractStudentFilters($request);

        if ($filters['grouped']) {
            $data = $studentReportsService->getArrearsGroupedByGrade(
                academicYear: $filters['academicYear'],
                language: $filters['language'],
                level: $filters['level'],
                grade: $filters['grade'],
                classroom: $filters['classroom'],
                min: $filters['min'],
                sorting: $filters['sorting'],
                type: $filters['type']
            );
            $view = 'reports.arrears_grouped';
            $baseTitle = "متأخرات";
            $viewData = [
                'grades' => $data,
                'academic_year' => $filters['academicYear']
            ];
        } else {
            $data = $studentReportsService->getStudentsGroupedByClassrooms(
                academicYear: $filters['academicYear'],
                language: $filters['language'],
                level: $filters['level'],
                grade: $filters['grade'],
                classroom: $filters['classroom'],
                min: $filters['min'],
                sorting: $filters['sorting'],
                type: $filters['type'],
                per_chunk: $filters['per_chunk'],
                includePayments: true,
                show_notes: $filters['show_notes']
            );
            $view = 'reports.arrears';
            $baseTitle = "متأخرات";
            $viewData = [
                'classrooms' => $data,
            ];
        }

        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";
        $dir = storage_path('app/reports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $type = PaymentType::from($filters['type']);
        $typeValue = match ($type) {
            PaymentType::TUITION, PaymentType::ADMINISTRATIVE, PaymentType::ADDITIONAL => preg_replace('/(?<!\p{Arabic})(?!ال)(\p{Arabic}+)/u', 'ال$1', $type->value),
            default => $type->value
        };
        $title = $baseTitle . ' ' . $typeValue;
        $viewData['title'] = $title;

        if ($request->query('export') === 'excel') {
            $exportClass = $filters['grouped'] ? ArrearsGroupedExport::class : ArrearsExport::class;
            return Excel::download(new $exportClass($viewData), 'arrears.xlsx');
        }

        Pdf::view($view, $viewData)
            ->format('a4')
            ->orientation(Orientation::Landscape)
            ->footerView('components.pdf-footer')
            ->margins(10, 5, 10, 5)
            ->save(storage_path(("app/$filePath")));

        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid, true),
        ]);
    }

    public function studentLetters(GenerateLetterRequest $request, StudentReportService $service): JsonResponse|BinaryFileResponse
    {
        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";

        $filters = $this->extractStudentFilters($request);
        $studentsByClassrooms = $service->getStudentsGroupedByClassrooms(
            academicYear: $filters['academicYear'],
            language: $filters['language'],
            level: $filters['level'],
            grade: $filters['grade'],
            classroom: $filters['classroom'],
            min: $filters['min'],
            sorting: $filters['sorting'],
            type: $filters['type'],
            per_chunk: $filters['per_chunk'],
            show_notes: $filters['show_notes']
        );

        $dir = storage_path('app/reports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $viewData = [
            'letter' => $request->validated('letter'),
            'studentsByClassrooms' => $studentsByClassrooms,
        ];

        if ($request->query('export') === 'excel') {
            return Excel::download(new LettersExport($viewData), 'letters.xlsx');
        }

        Pdf::view('reports.letters', $viewData)
            ->format('a4')
            ->margins(0, 0, 10, 0)
            ->footerView("components.pdf-footer")
            ->save(storage_path("app/$filePath"));


        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid, true),
        ]);
    }

    /**
     * Extract student filter parameters from the request.
     *
     * @param GenerateArrearsReportRequest|GenerateLetterRequest $request
     * @return array
     */
    private function extractStudentFilters(GenerateArrearsReportRequest|GenerateLetterRequest $request): array
    {
        $validated = $request->validated();

        return [
            'academicYear' => $validated['academic_year'] ?? null,
            'language' => $validated['language'] ?? null,
            'level' => $validated['level'] ?? null,
            'grade' => isset($validated['grade']) ? (int)$validated['grade'] : null,
            'classroom' => isset($validated['classroom']) ? (int)$validated['classroom'] : null,
            'min' => isset($validated['min']) ? (float)$validated['min'] : 0,
            'sorting' => $validated['sorting'] ?? null,
            'type' => $validated['type'] ?? PaymentType::TUITION->value,
            'per_chunk' => $validated['per_chunk'] ?? 12,
            'show_notes' => $validated['show_notes'] ?? false,
            'grouped' => $validated['grouped'] ?? false,
        ];
    }


    public function dailyPayments(GenerateDailyPaymentsReportRequest $request): JsonResponse|BinaryFileResponse
    {
        ["uuid" => $uuid, "filePath" => $filePath] = generateReportUUID();

        $requestData = $request->validated();

        $query = Payment::query()
            ->with([
                'student' => fn($q) => $q->select('id', 'name_in_arabic', 'classroom_id'),
                'student.classroom' => fn($q) => $q->select('id', 'name'),
                'recipient:id,name'
            ])
            ->where('date', $requestData['date'])
            ->where('payments.academic_year', $requestData['academic_year'])
            ->where('type', $requestData['type'])
            ->when(isset($requestData['recipient_id']), fn($q) => $q->where('recipient_id', $requestData['recipient_id']))
            ->select([
                'payments.id',
                'payments.value',
                'payments.student_id',
                'payments.date',
                'payments.academic_year',
                'payments.type',
                'payments.recipient_id'
            ]);

        $type = PaymentType::from($requestData['type']);
        $typeValue = match ($type) {
            PaymentType::TUITION, PaymentType::ADMINISTRATIVE, PaymentType::ADDITIONAL => preg_replace('/(?<!\p{Arabic})(?!ال)(\p{Arabic}+)/u', 'ال$1', $type->value),
            default => $type->value
        };

        $perChunk = $requestData['per_chunk'] ?? 12;
        $payments = $query->get()
            ->groupBy('recipient_id')
            ->map(fn($group) => $group->chunk($perChunk));

        $viewData = [
            'payments' => $payments,
            'date' => Carbon::parse($requestData['date'])->locale('ar'),
            'title' => 'مدفوعات اليوم',
            'type' => $typeValue
        ];

        if ($request->query('export') === 'excel') {
            return Excel::download(new DailyPaymentsExport($viewData), 'daily_payments.xlsx');
        }

        Pdf::view('reports.daily_payments', $viewData)
            ->orientation(Orientation::Landscape)
            ->format(Format::A4)
            ->footerView('components.pdf-footer')
            ->margins(5, 5, 10, 5)
            ->save(storage_path("app/$filePath"));

        return response()->json([
            "uuid" => $uuid,
            "preview_url" => route('reports.preview', $uuid, true)
        ]);
    }
}
