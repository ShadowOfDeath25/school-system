<?php

namespace App\Http\Controllers;

use App\Models\SeatNumber;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class SeatNumberController extends Controller
{
    use hasCRUD;
    protected string $model = SeatNumber::class;
    protected string $storeRequest = \App\Http\Requests\SeatNumber\StoreSeatNumberRequest::class;
    protected string $updateRequest = \App\Http\Requests\SeatNumber\UpdateSeatNumberRequest::class;
    
}
