<?php

namespace App\Http\Controllers;

use App\Http\Requests\BankAccount\StoreBankAccountRequest;
use App\Http\Requests\BankAccount\UpdateBankAccountRequest;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class BankAccountController extends Controller
{
    use hasCRUD;
    protected string $model = BankAccount::class;
    protected string $storeRequest = StoreBankAccountRequest::class;
    protected string $updateRequest = UpdateBankAccountRequest::class;
}
