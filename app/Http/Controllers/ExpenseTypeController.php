<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseType\StoreExpenseTypeRequest;
use App\Models\ExpenseType;
use App\Traits\HasCRUD;

class ExpenseTypeController extends Controller
{
    use HasCRUD;

    protected string $model = ExpenseType::class;

    protected string $storeRequest = StoreExpenseTypeRequest::class;

    protected string $updateRequest = StoreExpenseTypeRequest::class;
}
