<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\PaymentSummaryRequest;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Requests\Payment\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\User;
use App\Services\SummaryService;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Client\Request;


class PaymentController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Payment::class;
    protected string $updateRequest = UpdatePaymentRequest::class;
    protected string $storeRequest = StorePaymentRequest::class;
    protected array $filterable = [
        'student_id',
        'academic_year',
        'type',
        'recipient'
    ];

    public function recipients()
    {
        return response()->json(User::whereIn('id', Payment::distinct()->pluck('recipient_id'))->select(['id', 'name'])->get());
    }


}
