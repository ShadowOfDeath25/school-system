<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bus\StoreBusRequest;
use App\Http\Requests\Bus\UpdateBusRequest;
use App\Models\Bus;
use App\Traits\HasCRUD;

class BusController extends Controller
{
    use HasCRUD;

    protected string $model = Bus::class;
    protected string $storeRequest = StoreBusRequest::class;
    protected string $updateRequest = UpdateBusRequest::class;
}
