<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guardian\StoreGuardianRequest;
use App\Http\Requests\Guardian\UpdateGuardianRequest;
use App\Http\Resources\GuardianResource;
use App\Models\Guardian;
use App\Traits\HasCRUD;

class GuardianController extends Controller
{
    use HasCRUD;

    protected string $model = Guardian::class;
    protected string $storeRequest = StoreGuardianRequest::class;
    protected string $updateRequest = UpdateGuardianRequest::class;
    protected string $resource = GuardianResource::class;
}
