<?php

namespace App\Http\Controllers;

use App\Http\Requests\SecretNumber\StoreSecretNumberRequest;
use App\Http\Requests\SecretNumber\UpdateSecretNumberRequest;
use App\Models\SecretNumber;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class SecretNumberController extends Controller
{
    use hasCRUD;
    protected string $model = SecretNumber::class;
    protected string $storeRequest = StoreSecretNumberRequest::class;
    protected string $updateRequest = UpdateSecretNumberRequest::class;

}
