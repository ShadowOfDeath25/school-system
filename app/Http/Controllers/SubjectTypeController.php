<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubjectType\StoreSubjectTypeRequest;
use App\Models\SubjectType;
use App\Traits\HasCRUD;

class SubjectTypeController extends Controller
{
    use HasCRUD;

    protected string $model = SubjectType::class;
    protected string $storeRequest = StoreSubjectTypeRequest::class;
    protected string $updateRequest = StoreSubjectTypeRequest::class;

}
