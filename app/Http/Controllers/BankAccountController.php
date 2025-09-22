<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class BankAccountController extends Controller
{
    use hasCRUD;
    protected string $model = BankAccount::class;
    protected string $storeRequest = \App\Http\Requests\BankAccount\StoreBankAccountRequest::class;
    protected string $updateRequest = \App\Http\Requests\BankAccount\UpdateBankAccountRequest::class;
}
