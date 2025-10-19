<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeType\StoreIncomeTypeRequest;
use App\Models\IncomeType;
use App\Traits\HasCRUD;

class IncomeTypeController extends Controller
{
    use HasCRUD;

    protected string $model = IncomeType::class;
    protected string $storeRequest = StoreIncomeTypeRequest::class;
    protected string $updateRequest = StoreIncomeTypeRequest::class;

}
