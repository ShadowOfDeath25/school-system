<?php

namespace App\Http\Controllers;

use App\Http\Requests\Uniform\StoreUniformRequest;
use App\Http\Requests\Uniform\UpdateUniformRequest;
use App\Http\Resources\UniformResource;
use App\Models\Uniform;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class UniformController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Uniform::class;
    protected string $storeRequest = StoreUniformRequest::class;
    protected string $updateRequest = UpdateUniformRequest::class;
    protected string $resource = UniformResource::class;
}
