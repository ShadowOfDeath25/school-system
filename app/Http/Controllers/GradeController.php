<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\AssignSubjectsToGradeRequest;
use App\Http\Requests\Subject\DetachSubjectFromGradeRequest;
use App\Http\Requests\Subject\UpdateGradeSubjectsRequest;
use App\Http\Resources\GradeResource;
use App\Http\Resources\GradeSubjectResource;
use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeController extends Controller
{
    public function assignSubjects(Grade $grade, AssignSubjectsToGradeRequest $request)
    {
        $subjectData = $request->validated();
        $grade->subjects()->attach($subjectData['subject_id'], $subjectData);
        return response()->json($grade->subjects()->get(), 200);
    }

    public function index()
    {
        return GradeResource::collection(Grade::paginate(request()->input('per_page', 30))->withQueryString());
    }

    public function updateSubjects(UpdateGradeSubjectsRequest $request, Grade $grade)
    {
        $subjectData = $request->validated();
        $grade->subjects()->updateExistingPivot($subjectData['subject_id'], $subjectData);
        return response()->json($grade->subjects, 200);
    }

    public function deleteSubjects(DetachSubjectFromGradeRequest $request, Grade $grade)
    {
        $grade->subjects()->detach($request->validated('subjects'));
        return response()->json($grade->subjects()->get(), 200);
    }

    public function getSubjects(Grade $grade, Request $request)
    {
        if ($request->has("language")) {
            $language = $request->validate(['language' => "string|in:عربي,لغات"]);
            return GradeSubjectResource::collection($grade->subjects()->wherePivot('language', $language)->get());
        }
        return GradeSubjectResource::collection($grade->subjects);
    }

    public function getAvailableSubjects(Grade $grade, Request $request)
    {
        $language = $request->validate(['language' => "string|in:عربي,لغات"]);
        $subjects = Subject::whereDoesntHave('grades', function ($query) use ($grade, $language) {
            $query->where('grade', $grade->grade)
                ->where('language', $language);
        })->where('language', $language)->get();
        return response()->json(["data" => $subjects]);
    }
}
