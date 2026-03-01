<?php

namespace App\Http\Controllers;

use App\Enums\PaymentType;
use App\Http\Requests\Student\Reports\GenerateArrearsReportRequest;
use App\Http\Requests\Student\Reports\GenerateDailyPaymentsReportRequest;
use App\Http\Requests\Student\Reports\GenerateLetterRequest;
use App\Models\Payment;
use App\Models\Student;
use App\Services\StudentReportService;
use Carbon\Carbon;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Str;
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
    public function arrearsReport(GenerateArrearsReportRequest $request, StudentReportService $studentReportsService): JsonResponse
    {
        $classrooms = $studentReportsService->getStudentsGroupedByClassrooms(
            ...$this->extractStudentFilters($request),
            includePayments: true
        );

        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";
        $dir = storage_path('app/reports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $baseTitle = "متأخرات";
        $type = PaymentType::from($request->validated('type'));
        $typeValue = match ($type) {
            PaymentType::TUITION, PaymentType::ADMINISTRATIVE, PaymentType::ADDITIONAL => preg_replace('/(?<!\p{Arabic})(?!ال)(\p{Arabic}+)/u', 'ال$1', $type->value),
            default => $type->value
        };
        $title = $baseTitle . ' ' . $typeValue;
        Pdf::view('reports.arrears', [
            'classrooms' => $classrooms,
            'title' => $title
        ])
            ->format('a4')
            ->orientation(Orientation::Landscape)
            ->footerView('components.pdf-footer')
            ->margins(10, 5, 10, 5)
            ->save(storage_path(("app/$filePath")));
        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid),
        ]);
    }

    /**
     * Get student letters for students with outstanding payments.
     *
     * @param GenerateLetterRequest $request
     * @param StudentReportService $service
     * @return JsonResponse
     */
    public function studentLetters(GenerateLetterRequest $request, StudentReportService $service): JsonResponse
    {
        $uuid = Str::uuid()->toString();
        $filePath = "reports/$uuid.pdf";

        $studentsByClassrooms = $service->getStudentsGroupedByClassrooms(
            ...$this->extractStudentFilters($request),

        );

        $dir = storage_path('app/reports');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        Pdf::view('reports.letters', [
            'letter' => $request->validated('letter'),
            'studentsByClassrooms' => $studentsByClassrooms,
        ])
            ->format('a4')
            ->margins(0, 0, 10, 0)
            ->footerView("components.pdf-footer")
            ->save(storage_path("app/$filePath"));


        return response()->json([
            'uuid' => $uuid,
            'preview_url' => route('reports.preview', $uuid),
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
        ];
    }

    public function test()
    {
        return auth()->user();

    }

    public function dailyPayments(GenerateDailyPaymentsReportRequest $request): JsonResponse
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
            ->when($requestData['recipient_id'], fn($q) => $q->where('recipient_id', $requestData['recipient_id']))
            ->select([
                'payments.id',
                'payments.value',
                'payments.student_id',
                'payments.date',
                'payments.academic_year',
                'payments.type'
            ]);


        $type = PaymentType::from($requestData['type']);
        $typeValue = match ($type) {
            PaymentType::TUITION, PaymentType::ADMINISTRATIVE, PaymentType::ADDITIONAL => preg_replace('/(?<!\p{Arabic})(?!ال)(\p{Arabic}+)/u', 'ال$1', $type->value),
            default => $type->value
        };


        $payments = $query->get()->chunk($requestData['per_chunk'] ?? 12);

        Pdf::view('reports.daily_payments', [
            'payments' => $payments,
            'date' => Carbon::parse($requestData['date'])->locale('ar'),
            'title' => 'مدفوعات اليوم',
            'type' => $typeValue
        ])
            ->orientation(Orientation::Landscape)
            ->format(Format::A4)
            ->footerView('components.pdf-footer')
            ->margins(5, 5, 10, 5)
            ->save(storage_path("app/$filePath"));

        return response()->json([
            "uuid" => $uuid,
            "preview_url" => route('reports.preview', $uuid)
        ]);
    }
}
