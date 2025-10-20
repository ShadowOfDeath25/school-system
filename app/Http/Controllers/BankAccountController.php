<?php

namespace App\Http\Controllers;

use App\Http\Requests\BankAccount\StoreBankAccountRequest;
use App\Http\Requests\BankAccount\UpdateBankAccountRequest;
use App\Http\Resources\BankAccountResource;
use App\Models\BankAccount;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class BankAccountController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = BankAccount::class;
    protected string $storeRequest = StoreBankAccountRequest::class;
    protected string $updateRequest = UpdateBankAccountRequest::class;
    protected string $resource = BankAccountResource::class;
    protected array $filterable = ['academic_year', 'type'];

}
