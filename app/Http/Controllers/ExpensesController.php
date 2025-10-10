<?php

namespace App\Http\Controllers;

use App\Http\Requests\Expenses\StoreExpensesRequest;
use App\Http\Requests\Expenses\UpdateExpensesRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Traits\HasFilters;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class ExpensesController extends Controller
{
    use HasCRUD, HasFilters;

    //todo: check which way is better, using a plain column or a relation
    protected array $filterable = [
        'academic_year', 'type'
    ];
    protected string $model = Expense::class;
    protected string $storeRequest = StoreExpensesRequest::class;
    protected string $updateRequest = UpdateExpensesRequest::class;
    protected string $resource = ExpenseResource::class;

}
