<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeAge\StoreGradeAgeRequest;
use App\Http\Requests\GradeAge\UpdateGradeAgeRequest;
use App\Http\Resources\GradeAgeResource;
use App\Models\GradeAge;
use App\Traits\HasCRUD;

class GradeAgeController extends Controller
{
    use HasCRUD;

    protected string $model = GradeAge::class;

    protected string $storeRequest = StoreGradeAgeRequest::class;

    protected string $updateRequest = UpdateGradeAgeRequest::class;

    protected string $resource = GradeAgeResource::class;

    protected array $relationsToLoad = ['grade'];
}
