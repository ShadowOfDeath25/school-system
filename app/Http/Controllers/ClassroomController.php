<?php

namespace App\Http\Controllers;

use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
use App\Http\Resources\ClassroomResource;
use App\Models\Classroom;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Database\Eloquent\Builder;


class ClassroomController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Classroom::class;
    protected string $storeRequest = StoreClassroomRequest::class;
    protected string $updateRequest = UpdateClassroomRequest::class;
    protected string $resource = ClassroomResource::class;
    protected array $filterable = [
        'academic_year',
        'level',
        'language',
        'grade'
    ];
    protected array $relationsToLoad = ['students'];


    protected function query(): Builder
    {
        return $this->model::query()
            ->withCount('students')
            ->with($this->relationsToLoad);
    }

    public function store(StoreClassroomRequest $request)
    {
        $this->authorizeAction("create");
        $data = $request->validated();
        $classroom = new Classroom($data);
        $lastClassroom = Classroom::where("grade", $data['grade'])
            ->where('level', $data['level'])
            ->where('academic_year', $data['academic_year'])
            ->where('language', $data['language'])
            ->orderBy("id", "desc")
            ->first();
        $classroom->class_number = $lastClassroom ? $lastClassroom->class_number + 1 : 1;
        $classroom->save();

        return response()->json(ClassroomResource::make($classroom), 201);
    }


}
