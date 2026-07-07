<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamHall\StoreExamHallRequest;
use App\Http\Requests\ExamHall\UpdateExamHallRequest;
use App\Http\Resources\ExamHallResource;
use App\Models\AcademicYear;
use App\Models\ExamHall;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ExamHallController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        "academic_year",
        "classroom.level",
        "classroom.grade",
        "classroom.language",
    ];

    protected array $searchable = ['number'];

    protected array $relationsToLoad = ['classroom'];

    protected string $model = ExamHall::class;

    protected string $storeRequest = StoreExamHallRequest::class;

    protected string $updateRequest = UpdateExamHallRequest::class;

    protected string $resource = ExamHallResource::class;

    protected function query(): Builder
    {
        return ExamHall::query()
            ->with('classroom')
            ->orderBy('academic_year', 'desc')
            ->orderBy('number');
    }

    public function store(StoreExamHallRequest $request)
    {
        $data = $request->validated();
        $data['academic_year'] ??= AcademicYear::activeCached()?->name;

        $hall = new ExamHall($data);
        $hall->save();

        return response()->json(ExamHallResource::make($hall), 201);
    }
}
