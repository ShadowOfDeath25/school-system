<?php

namespace App\Http\Controllers;

use App\Http\Requests\Station\StoreStationRequest;
use App\Http\Requests\Station\UpdateStationRequest;
use App\Models\Station;
use App\Traits\HasCRUD;
use Illuminate\Http\Request;

class StationController extends Controller
{
    use HasCRUD;

    protected string $model = Station::class;
    protected string $storeRequest = StoreStationRequest::class;
    protected string $updateRequest = UpdateStationRequest::class;

}
