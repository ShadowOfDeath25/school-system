<?php

namespace App\Http\Controllers;

use App\Http\Requests\Building\StoreBuildingRequest;
use App\Http\Requests\Building\UpdateBuildingRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Database\Eloquent\Builder;

class BuildingController extends Controller
{

    use HasCRUD, HasFilters;

    protected string $model = Building::class;
    protected string $storeRequest = StoreBuildingRequest::class;
    protected string $updateRequest = UpdateBuildingRequest::class;
    protected string $resource = BuildingResource::class;

    public function query(): Builder
    {
        return Building::query()
            ->with('floors')
            ->withCount('floors');
    }

}
