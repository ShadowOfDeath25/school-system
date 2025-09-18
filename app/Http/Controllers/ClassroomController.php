<?php

namespace App\Http\Controllers;

use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
use App\Models\Classroom;
use App\Traits\HasCRUD;


class ClassroomController extends Controller
{
    use HasCRUD;

    protected string $model = Classroom::class;
    protected string $storeRequest = StoreClassroomRequest::class;
    protected string $updateRequest = UpdateClassroomRequest::class;

    public function store(StoreClassroomRequest $request)
    {
        $this->authorizeAction("create");
        $data = $request->validated();
        $classroom = new Classroom($data);
        $lastClassroom = Classroom::where("grade", $data['grade'])
            ->where('level', $data['level'])
            ->orderBy("id", "desc")
            ->first();
        $classroom->class_number = $lastClassroom ? $lastClassroom->class_number + 1 : 1;
        $classroom->save();
        return response()->json($classroom, 201);
    }


}
