<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\AssignSubjectsToGradeRequest;
use App\Http\Requests\Subject\DetachSubjectFromGradeRequest;
use App\Http\Requests\Subject\UpdateGradeSubjectsRequest;
use App\Models\Grade;
use App\Models\GradeSubject;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function assignSubjects(AssignSubjectsToGradeRequest $request, Grade $grade)
    {
        $grade->subjects()->syncWithoutDetaching($request->validated('subjects'));
        return response()->json("", 200);
    }

    public function updateSubjects(UpdateGradeSubjectsRequest $request, Grade $grade)
    {
        $subjects = collect($request->validated('subjects'))
            ->map(fn($s) => [
                ...$s,
                'grade_id' => $grade->id,
            ])
            ->toArray();
        GradeSubject::upsert(
            $subjects,
            ['grade_id', 'subject_id', 'language'],
        );
    }

    public function deleteSubjects(DetachSubjectFromGradeRequest $request, Grade $grade)
    {
        $grade->subjects()->detach($request->validated('subjects'));
    }
}
