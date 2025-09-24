<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeatNumber\StoreSeatNumberRequest;
use App\Http\Requests\SeatNumber\UpdateSeatNumberRequest;
use App\Models\SeatNumber;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class SeatNumberController extends Controller
{
    use hasCRUD;
    protected string $model = SeatNumber::class;
    protected string $storeRequest = StoreSeatNumberRequest::class;
    protected string $updateRequest = UpdateSeatNumberRequest::class;

}
