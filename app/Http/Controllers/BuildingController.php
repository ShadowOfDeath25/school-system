<?php

namespace App\Http\Controllers;

use App\Http\Requests\Building\StoreBuildingRequest;
use App\Http\Requests\Building\UpdateBuildingRequest;
use App\Models\Building;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;

class BuildingController extends Controller
{

    use HasCRUD,HasFilters;
    protected string $model = Building::class;
    protected string $storeRequest = StoreBuildingRequest::class;
    protected string $updateRequest = UpdateBuildingRequest::class;
}
