<?php

namespace App\Http\Controllers;

use App\Exports\ExamTimetableExport;
use App\Models\AcademicYear;
use App\Models\Exam;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Orientation;
use Spatie\LaravelPdf\Facades\Pdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExamReportController extends Controller
{
    public function timetable(Request $request): JsonResponse|BinaryFileResponse
    {
        $academicYear = $request->input('academic_year', AcademicYear::activeCached()?->name);
        $validated = $request->validate([
            'language' => 'required|string',
            'semester' => 'required|string|in:الأول,الثاني',
        ]);
        $language = $validated['language'];
        $semester = $validated['semester'];
        $grade = $request->input('grade') ? (int) $request->input('grade') : null;
        $level = $request->input('level');

        $gradeNumbers = match ($level) {
            'رياض أطفال' => [1, 2],
            'ابتدائي'    => [3, 4, 5, 6],
            'اعدادي'     => [7, 8, 9, 10, 11],
            default      => [],
        };

        $exams = Exam::with(['gradeSubject.subject', 'gradeSubject.grade'])
            ->where('academic_year', $academicYear)
            ->where('language', $language)
            ->where('semester', $semester)
            ->when($grade || $gradeNumbers, fn ($q) => $q->whereHas(
                'gradeSubject.grade',
                fn ($q) => $q->whereIn('grade', $grade ? [$grade] : $gradeNumbers)
            ))
            ->get()
            ->filter(fn (Exam $exam) => $exam->component && ($exam->component['is_final_exam'] ?? false))
            ->values();

        $grouped = $exams->groupBy(fn (Exam $exam) => $exam->gradeSubject->grade_id)
            ->sortKeys()
            ->map(function ($gradeExams, $gradeId) {
                $grade = $gradeExams->first()->gradeSubject->grade;

                $sortedExams = $gradeExams->sortBy('date')->values()->map(fn (Exam $exam, $idx) => [
                    'index' => $idx + 1,
                    'subject_name' => $exam->gradeSubject->subject->name,
                    'date' => $exam->date,
                    'day' => match (Carbon::parse($exam->date)->format('l')) {
                        'Sunday' => 'الأحد',
                        'Monday' => 'الاثنين',
                        'Tuesday' => 'الثلاثاء',
                        'Wednesday' => 'الأربعاء',
                        'Thursday' => 'الخميس',
                        'Friday' => 'الجمعة',
                        'Saturday' => 'السبت',
                        default => Carbon::parse($exam->date)->format('l'),
                    },
                    'time' => Carbon::parse($exam->date)->format('H:i'),
                    'duration' => (float) $exam->duration_in_hours,
                    'marks' => $exam->marks,
                    'type' => $exam->type,
                ]);

                return [
                    'grade_id' => (int) $gradeId,
                    'grade_name' => $grade?->name ?? "صف {$gradeId}",
                    'grade_number' => $grade?->grade,
                    'exams' => $sortedExams,
                    'total_exams' => $sortedExams->count(),
                ];
            })->values();

        $data = [
            'academic_year' => $academicYear,
            'language' => $language,
            'semester' => $semester,
            'grade' => $grade,
            'grades' => $grouped,
        ];

        if ($request->query('export') === 'pdf') {
            ['uuid' => $uuid, 'filePath' => $filePath] = generateReportUUID();

            Pdf::view('reports.exam_timetable', $data)
                ->format('a4')
                ->orientation(Orientation::Portrait)
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
                new ExamTimetableExport($data),
                'exam_timetable.xlsx',
            );
        }

        return response()->json($data);
    }
}
