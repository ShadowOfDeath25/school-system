<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bus\StoreBusRequest;
use App\Http\Requests\Bus\UpdateBusRequest;
use App\Models\Bus;

class BusController extends CRUDController
{
    protected string $model = Bus::class;
    protected string $storeRequest = StoreBusRequest::class;
    protected string $updateRequest = UpdateBusRequest::class;
}
