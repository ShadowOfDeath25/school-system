<?php

namespace App\Http\Controllers;

use App\Http\Requests\Expenses\StoreExpensesRequest;
use App\Http\Requests\Expenses\UpdateExpensesRequest;
use App\Models\Expense;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;
class ExpensesController extends Controller
{
    use hasCRUD;

    protected string $model = Expense::class;
    protected string $storeRequest = StoreExpensesRequest::class;
    protected string $updateRequest = UpdateExpensesRequest::class;

}
