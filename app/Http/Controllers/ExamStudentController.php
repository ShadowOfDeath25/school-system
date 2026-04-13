<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentMarkRequest;
use App\Models\ExamStudent;
use App\Models\Student;
use Illuminate\Http\Request;

class ExamStudentController extends Controller
{

    public function store(StoreStudentMarkRequest $request)
    {
        ExamStudent::create($request->validated());
        return response()->json(['message' => 'تم حفظ الدرجات بنجاح'], 201);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'exam_id' => ['required', 'exists:exams,id'],
            'student_id' => ['required', 'exists:students,id'],
        ]);

        $examStudent = ExamStudent::where('exam_id', $request->exam_id)
            ->where('student_id', $request->student_id)
            ->first();

        if (!$examStudent) {
            return response()->json(['message' => 'لم يتم العثور على درجات لهذا الطالب في هذا الامتحان'], 404);
        }

        $examStudent->delete();

        return response()->json(['message' => 'تم حذف الدرجات بنجاح']);

    }
}
