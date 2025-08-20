<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentParent\StoreStudentParentRequest;
use App\Http\Requests\StudentParent\UpdateStudentParentRequest;
use App\Http\Resources\StudentParentResource;
use App\Traits\HasCRUD;

class StudentParentController
{
    use HasCRUD;

    protected string $model = StudentParentController::class;
    protected string $storeRequest = StoreStudentParentRequest::class;
    protected string $updateRequest = UpdateStudentParentRequest::class;
    protected string $resource = StudentParentResource::class;
}
