<?php

namespace App\Http\Controllers;

use App\Http\Requests\Classroom\StoreClassroomRequest;
use App\Http\Requests\Classroom\UpdateClassroomRequest;
use App\Http\Resources\ClassroomResource;
use App\Models\Classroom;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;


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

        $isActive = request()->boolean('isActive');
        $withStudents = request()->boolean("withStudents");
        return $this->model::query()
            ->when($isActive, fn(Builder $query) => $query->active())
            ->withCount('students')
            ->when($withStudents, fn(Builder $query) => $query->with('students'))
            ->orderBy('academic_year', 'desc')
            ->orderBy('language')
            ->orderBy('level')
            ->orderBy('grade')
            ->orderBy('class_number');
    }

    public function store(StoreClassroomRequest $request)
    {
        $data = $request->validated();

        $existingClassNumbers = Classroom::where("grade", $data['grade'])
            ->where('level', $data['level'])
            ->where('academic_year', $data['academic_year'])
            ->where('language', $data['language'])
            ->pluck('class_number')
            ->sort()
            ->all();

        $newClassNumber = 1;
        foreach ($existingClassNumbers as $number) {
            if ($number != $newClassNumber) break;
            $newClassNumber++;
        }

        $classroom = new Classroom($data);
        $classroom->class_number = $newClassNumber;
        $classroom->name = $classroom->class_number . '/' . getGradeNumber($data['grade']) . ' ' . $data['level'];
        $classroom->save();

        return response()->json(ClassroomResource::make($classroom), 201);
    }


}
