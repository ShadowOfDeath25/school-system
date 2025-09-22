<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    
    use HasCRUD,HasFilters;
    protected string $model = Building::class;
    protected string $storeRequest = StoreBuildingRequest::class;
    protected string $updateRequest = UpdateBuildingRequest::class;
}
