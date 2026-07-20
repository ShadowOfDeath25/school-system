<?php

namespace App\Http\Controllers;

use App\Exports\StudentMarksExport;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Services\MarksReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MarksReportController extends Controller
{
    public function __construct(
        private MarksReportService $reportService,
    ) {}

    public function classReport(Request $request): JsonResponse|BinaryFileResponse
    {
        $academicYear = $request->input('academic_year', AcademicYear::activeCached()?->name);
        $validated = $request->validate([
            'language' => 'required|string',
        ]);
        $grade = (int) $request->input('grade');
        $language = $validated['language'];
        $semester = $request->input('semester', 'both');
        $classroomId = $request->input('classroom_id') ? (int) $request->input('classroom_id') : null;

        $data = $this->reportService->getClassReportData(
            academicYear: $academicYear,
            grade: $grade,
            language: $language,
            semester: $semester,
            classroomId: $classroomId,
        );

        if ($request->query('export') === 'pdf') {
            ['uuid' => $uuid, 'filePath' => $filePath] = generateReportUUID();

            Pdf::view('reports.student_marks', $data)
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

        if ($request->query('export') === 'excel') {
            return Excel::download(
                new StudentMarksExport($data),
                'student_marks.xlsx',
            );
        }

        return response()->json($data);
    }
}
