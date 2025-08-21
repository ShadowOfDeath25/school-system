<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;
class ExpensesController extends Controller
{
    use hasCRUD;

    protected string $model = Expenses::class;
    protected string $storeRequest = \App\Http\Requests\Expenses\StoreExpensesRequest::class;
    protected string $updateRequest = \App\Http\Requests\Expenses\UpdateExpensesRequest::class;

}
