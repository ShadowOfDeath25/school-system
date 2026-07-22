<?php

namespace App\Http\Controllers;

use App\Exports\StudentMarksExport;
use App\Exports\TopStudentsExport;
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
        $detailed = $request->boolean('detailed', false);

        $data = $this->reportService->getClassReportData(
            academicYear: $academicYear,
            grade: $grade,
            language: $language,
            semester: $semester,
            classroomId: $classroomId,
            detailed: $detailed,
        );

        $data['detailed'] = $detailed;

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
                new StudentMarksExport($data, $detailed),
                $detailed ? 'student_marks_detailed.xlsx' : 'student_marks.xlsx',
            );
        }

        return response()->json($data);
    }

    public function topStudentsReport(Request $request): JsonResponse|BinaryFileResponse
    {
        $academicYear = $request->input('academic_year', AcademicYear::activeCached()?->name);
        $validated = $request->validate([
            'language' => 'required|string',
            'level' => 'required|string',
        ]);
        $language = $validated['language'];
        $level = $validated['level'];
        $semester = $request->input('semester', 'both');
        $grade = $request->input('grade') ? (int) $request->input('grade') : null;

        $data = $this->reportService->getTopStudentsData(
            academicYear: $academicYear,
            language: $language,
            semester: $semester,
            level: $level,
            grade: $grade,
        );

        if ($request->query('export') === 'pdf') {
            ['uuid' => $uuid, 'filePath' => $filePath] = generateReportUUID();

            Pdf::view('reports.top_students', $data)
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
                new TopStudentsExport($data),
                'top_students.xlsx',
            );
        }

        return response()->json($data);
    }
}
