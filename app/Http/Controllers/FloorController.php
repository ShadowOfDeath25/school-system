<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class FloorController extends Controller
{
    use hasCRUD;
    protected string $model = Floor::class;
    protected string $storeRequest = \App\Http\Requests\Floor\StoreFloorRequest::class;
    protected string $updateRequest = \App\Http\Requests\Floor\UpdateFloorRequest::class;


}
