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
        $subjectData['components'] = $components->validate($subjectData['components'] ?? [], $subjectData['min_marks'] ?? null);
        $subjectData['max_marks'] = $components->totalMarks($subjectData['components']);

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

        if (array_key_exists('components', $subjectData)) {
            $subjectData['components'] = $components->validate($subjectData['components'], $subjectData['min_marks'] ?? null);
            $subjectData['max_marks'] = $components->totalMarks($subjectData['components']);
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