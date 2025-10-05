<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeatNumber\StoreSeatNumberRequest;
use App\Http\Requests\SeatNumber\UpdateSeatNumberRequest;
use App\Http\Resources\SeatNumberResource;
use App\Models\SeatNumber;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class SeatNumberController extends Controller
{
    use HasCrud, HasFilters;

    protected array $filterable = [
        'academic_year', "level", "grade", "language"
    ];
    protected array $searchable = [
        'grade', 'level'
    ];
    protected string $model = SeatNumber::class;
    protected string $storeRequest = StoreSeatNumberRequest::class;
    protected string $updateRequest = UpdateSeatNumberRequest::class;
    protected string $resource = SeatNumberResource::class;

}
