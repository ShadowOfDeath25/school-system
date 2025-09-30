<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Models\subject;
use App\Traits\HasCRUD;

class SubjectController extends Controller
{
    use HasCRUD;

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
}
