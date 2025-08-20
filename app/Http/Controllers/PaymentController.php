<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Payment;
use App\Traits\HasCRUD;

class PaymentController extends Controller
{
    use hasCRUD;
    protected string $model = Payment::class;
    protected string $updateRequest = StorePaymentRequest::class;
    protected string $storeRequest = StorePaymentRequest::class;

}
