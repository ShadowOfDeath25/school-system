<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exemption\FilterExemptionRequest;
use App\Http\Requests\Exemption\StoreExemptionRequest;
use App\Http\Requests\Exemption\UpdateExemptionRequest;
use App\Models\Exemption;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Resources\Json\JsonResource;

class ExemptionController extends Controller
{
    use HasCRUD {
        index as baseIndex;
    }
    use HasFilters;

    protected string $model = Exemption::class;
    protected string $storeRequest = StoreExemptionRequest::class;
    protected string $updateRequest = UpdateExemptionRequest::class;
    protected array $searchable = ['type', 'value'];
    protected array $filterable = [
        'type', 'student_id'
    ];

    public function index(FilterExemptionRequest $request)
    {
        $data = $request->validated();

        if (!empty($data['student_id'])) {

            $q = Exemption::query();

            if (!empty($data['type'])) {
                $q->where('type', $data["type"])
                    ->orWhere('student_id', $data["student_id"]);
            } else {
                $q->where('student_id', $data['student_id']);
            }


        } else {
            return $this->baseIndex($request);
        }

        $result = $q->paginate($request->input('per_page', 30))->withQueryString();

        return JsonResource::collection($result);
    }


}
