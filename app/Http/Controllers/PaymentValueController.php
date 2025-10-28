<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentValue\StorePaymentValueRequest;
use App\Http\Requests\PaymentValue\UpdatePaymentValueRequest;
use App\Models\PaymentValue;
use App\Traits\HasCRUD;

class PaymentValueController extends Controller
{
    use HasCRUD;

    protected string $model = PaymentValue::class;
    protected string $storeRequest = StorePaymentValueRequest::class;
    protected string $updateRequest = UpdatePaymentValueRequest::class;
}
