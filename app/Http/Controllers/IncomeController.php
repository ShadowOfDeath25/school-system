<?php

namespace App\Http\Controllers;

use App\Http\Requests\Income\StoreIncomeRequest;
use App\Models\Income;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class IncomeController extends Controller
{
    use hasCRUD;
    protected string $model = Income::class;
    protected string $updateRequest = StoreIncomeRequest::class;
    protected string $storeRequest = StoreIncomeRequest::class;

}
