<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentValue\StorePaymentValueRequest;
use App\Http\Requests\PaymentValue\UpdatePaymentValueRequest;
use App\Http\Resources\PaymentValueResource;
use App\Models\PaymentValue;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;

class PaymentValueController extends Controller
{
    use HasCRUD {
        store as baseStore;
    }
    use HasFilters;

    protected string $model = PaymentValue::class;
    protected string $storeRequest = StorePaymentValueRequest::class;
    protected string $updateRequest = UpdatePaymentValueRequest::class;
    protected string $resource = PaymentValueResource::class;
    protected array $searchable = [
        'academic_year', 'type', 'language', 'level'
    ];
    protected array $filterable = [
        'academic_year', 'type', 'language', 'level'
    ];

    public function store(StorePaymentValueRequest $request)
    {
        $data = $request->validated();
        $q = PaymentValue::query();
        foreach ($data as $key => $value) {
            if ($key !== 'value') {
                $q->where($key, '=', $value);
            }
        }
        if ($q->exists()) {
            return response()->json(['message' => 'هذا العنصر موجود بالفعل'], 409);
        }
        return $this->baseStore($request);
    }



}
