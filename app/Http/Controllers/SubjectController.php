<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\subject;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class SubjectController extends Controller
{
    use HasCRUD,HasFilters;

    protected array $filterable = [
        'academic_year',
        'language',
        'level',
        'grade',
        'semester',
        'type'
    ];
    protected string $model = subject::class;
    protected string $storeRequest = StoreSubjectRequest::class;
    protected string $updateRequest = UpdateSubjectRequest::class;
    protected string $resource = SubjectResource::class;
}
