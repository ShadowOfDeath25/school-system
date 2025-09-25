<?php

namespace App\Http\Controllers;

use App\Http\Requests\Floor\StoreFloorRequest;
use App\Http\Requests\Floor\UpdateFloorRequest;
use App\Http\Resources\FloorResource;
use App\Models\Floor;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class FloorController extends Controller
{
    use hasCRUD;
    protected string $model = Floor::class;
    protected string $storeRequest = StoreFloorRequest::class;
    protected string $updateRequest = UpdateFloorRequest::class;
    protected string $resource = FloorResource::class;

}
