<?php

namespace App\Http\Controllers;

use App\Http\Requests\Parent\StoreParentRequest;
use App\Http\Requests\Parent\UpdateParentRequest;
use App\Http\Resources\ParentResource;
use App\Models\Guardian;
use App\Traits\HasCRUD;

class GuardianController extends Controller
{
    use HasCRUD;

    protected string $model = Guardian::class;

    protected string $storeRequest = StoreParentRequest::class;

    protected string $updateRequest = UpdateParentRequest::class;

    protected string $resource = ParentResource::class;
}
