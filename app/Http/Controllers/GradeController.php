<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\AssignSubjectsToGradeRequest;
use App\Http\Requests\Subject\DetachSubjectFromGradeRequest;
use App\Http\Requests\Subject\UpdateGradeSubjectsRequest;
use App\Http\Resources\GradeResource;
use App\Http\Resources\GradeSubjectResource;
use App\Models\Grade;
use App\Models\Subject;
use App\Services\GradingComponentService;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function assignSubjects(Grade $grade, AssignSubjectsToGradeRequest $request, GradingComponentService $components)
    {
        $subjectData = $request->validated();
        $useMonthlyMedian = filter_var($subjectData['use_monthly_median'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $semester = $subjectData['semester'] ?? null;
        $subjectData['use_monthly_median'] = $useMonthlyMedian;
        $subjectData['components'] = $components->validate($subjectData['components'] ?? [], $subjectData['min_marks'] ?? null, $useMonthlyMedian, $semester);
        $subjectData['max_marks'] = $components->totalMarks($subjectData['components'], $useMonthlyMedian, $semester);

        $grade->subjects()->attach($subjectData['subject_id'], $subjectData);

        return GradeSubjectResource::collection($grade->subjects()->get());
    }

    public function index()
    {
        return GradeResource::collection(Grade::paginate(request()->input('per_page', 30))->withQueryString());
    }

    public function updateSubjects(UpdateGradeSubjectsRequest $request, Grade $grade, GradingComponentService $components)
    {
        $subjectData = $request->validated();

        $existingPivot = $grade->subjects()->where('subject_id', $subjectData['subject_id'])->first()?->pivot;
        $useMonthlyMedian = array_key_exists('use_monthly_median', $subjectData)
            ? filter_var($subjectData['use_monthly_median'], FILTER_VALIDATE_BOOLEAN)
            : (bool) ($existingPivot?->use_monthly_median ?? false);

        if (array_key_exists('use_monthly_median', $subjectData)) {
            $subjectData['use_monthly_median'] = $useMonthlyMedian;
        }

        if (array_key_exists('components', $subjectData)) {
            $semester = $subjectData['semester'] ?? $existingPivot?->semester;
            $subjectData['components'] = $components->validate($subjectData['components'], $subjectData['min_marks'] ?? null, $useMonthlyMedian, $semester);
            $subjectData['max_marks'] = $components->totalMarks($subjectData['components'], $useMonthlyMedian, $semester);
        }

        $grade->subjects()->updateExistingPivot($subjectData['subject_id'], $subjectData);

        return GradeSubjectResource::collection($grade->subjects()->get());
    }

    public function deleteSubjects(DetachSubjectFromGradeRequest $request, Grade $grade)
    {
        $grade->subjects()->detach($request->validated('subjects'));

        return response()->json($grade->subjects()->get(), 200);
    }

    public function getSubjects(Grade $grade, Request $request)
    {
        if ($request->has('language')) {
            $language = $request->validate(['language' => 'string|in:عربي,لغات']);

            return GradeSubjectResource::collection($grade->subjects()->wherePivot('language', $language)->get());
        }

        return GradeSubjectResource::collection($grade->subjects);
    }

    public function getAvailableSubjects(Grade $grade, Request $request)
    {
        $language = $request->validate(['language' => 'string|in:عربي,لغات']);
        $subjects = Subject::whereDoesntHave('grades', function ($query) use ($grade, $language) {
            $query->where('grade', $grade->grade)
                ->where('language', $language);
        })->where('language', $language)->get();

        return response()->json(['data' => $subjects]);
    }
}