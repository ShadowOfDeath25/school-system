<?php

namespace App\Http\Controllers;

use App\Models\income;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class IncomeController extends Controller
{
    use hasCRUD;
    protected string $model = income::class;
    protected string $updateRequest = \App\Http\Requests\Income\StoreIncomeRequest::class;
    protected string $storeRequest = \App\Http\Requests\Income\StoreIncomeRequest::class;

}
