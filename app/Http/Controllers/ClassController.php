<?php

namespace App\Http\Controllers;

use App\Http\Requests\Class\StoreClassRequest;
use App\Http\Requests\Class\UpdateClassRequest;
use App\Models\ClassModel;
use App\Traits\HasCRUD;


class ClassController extends Controller
{
    use HasCRUD;

    protected string $model = ClassModel::class;
    protected string $storeRequest = StoreClassRequest::class;
    protected string $updateRequest = UpdateClassRequest::class;


}
