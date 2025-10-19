<?php

namespace App\Http\Controllers;

use App\Http\Requests\Income\StoreIncomeRequest;
use App\Http\Requests\Income\UpdateIncomeRequest;
use App\Http\Resources\IncomeResource;
use App\Models\Income;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class IncomeController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Income::class;
    protected string $updateRequest = StoreIncomeRequest::class;
    protected string $storeRequest = UpdateIncomeRequest::class;
    protected string $resource = IncomeResource::class;
    protected array $filterable = [
        'type', 'academic_year'
    ];

}
