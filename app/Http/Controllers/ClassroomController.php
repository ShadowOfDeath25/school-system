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


}
