<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Payment;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class PaymentController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Payment::class;
    protected string $updateRequest = StorePaymentRequest::class;
    protected string $storeRequest = StorePaymentRequest::class;
    protected array $filterable = [
        'student_id',
        'academic_year'
    ];
}
