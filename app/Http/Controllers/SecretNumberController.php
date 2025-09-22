<?php

namespace App\Http\Controllers;

use App\Models\SecretNumber;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class SecretNumberController extends Controller
{
    use hasCRUD;
    protected string $model = SecretNumber::class;
    protected string $storeRequest = \App\Http\Requests\SecretNumber\StoreSecretNumberRequest::class;
    protected string $updateRequest = \App\Http\Requests\SecretNumber\UpdateSecretNumberRequest::class;
    
}
