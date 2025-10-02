<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exam\StoreExamRequest;
use App\Http\Requests\Exam\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class ExamController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'academic_year',
        'semester',
        'language',
        'level',
        'grade',
        'type',
        'subject.type',
        'subject.name',
    ];
    protected array $relationsToLoad = ['subject'];
    protected string $model = Exam::class;
    protected string $storeRequest = StoreExamRequest::class;
    protected string $updateRequest = UpdateExamRequest::class;
    protected string $resource = ExamResource::class;
}
