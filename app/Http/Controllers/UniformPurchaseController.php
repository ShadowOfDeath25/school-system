<?php

namespace App\Http\Controllers;

use App\Http\Requests\UniformPurchase\StoreUniformPurchaseRequest;
use App\Http\Requests\UniformPurchase\UpdateUniformPurchaseRequest;
use App\Http\Resources\UniformPurchaseResource;
use App\Models\Uniform;
use App\Models\UniformPurchase;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class UniformPurchaseController extends Controller
{
    use HasCRUD {
        store as baseStore;
    }
    use HasFilters;

    protected string $model = UniformPurchase::class;
    protected string $storeRequest = StoreUniformPurchaseRequest::class;
    protected string $updateRequest = UpdateUniformPurchaseRequest::class;
    protected string $resource = UniformPurchaseResource::class;
    protected array $filterable = [
        'uniform.academic_year', 'uniform.type'
    ];
    protected array $searchable = [
        'student_name',
    ];
    protected array $relationsToLoad = [
        'uniform'
    ];

    public function store(StoreUniformPurchaseRequest $request)
    {
        $this->authorizeAction('store');
        $data = $request->validated();
        $uniform = Uniform::findOrFail($data['uniform_id']);
        if ($uniform->available_quantity < $data['quantity']) {
            return response()->json(["message" => $uniform->available_quantity === 0 ? "نفذ هذا الزي" : "هذه الكمية غير متاحة"], 409);
        }
        $uniform->available_quantity -= $data['quantity'];
        $uniform->save();
        return $this->baseStore($request);
    }

}
