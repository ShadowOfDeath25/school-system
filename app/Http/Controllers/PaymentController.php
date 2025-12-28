<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\PaymentSummaryRequest;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Requests\Payment\UpdatePaymentRequest;
use App\Models\Payment;
use App\Services\SummaryService;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;


class PaymentController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Payment::class;
    protected string $updateRequest = UpdatePaymentRequest::class;
    protected string $storeRequest = StorePaymentRequest::class;
    protected array $filterable = [
        'student_id',
        'academic_year',
        'type'
    ];

    public function summary(PaymentSummaryRequest $request)
    {
        $data = $request->validated();
        $service = new SummaryService();
        $incomes = $service->getTotalIncome($data['start_date'], $data['end_date']);
        $expenses = $service->getTotalExpenses($data['start_date'], $data['end_date']);
        return response()->json(["incomes"=>$incomes, "expenses" => $expenses]);
    }
}
