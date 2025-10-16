<?php

namespace App\Http\Controllers;

use App\Http\Requests\Uniform\StoreUniformRequest;
use App\Http\Requests\Uniform\UpdateUniformRequest;
use App\Http\Resources\UniformResource;
use App\Models\Uniform;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;

class UniformController extends Controller
{
    use HasCRUD {
        index as baseIndex;
    }
    use HasFilters;

    protected array $filterable = [
        'type', 'academic_year'
    ];
    protected array $searchable = [
        'type'
    ];
    protected string $model = Uniform::class;
    protected string $storeRequest = StoreUniformRequest::class;
    protected string $updateRequest = UpdateUniformRequest::class;
    protected string $resource = UniformResource::class;

    public function update(UpdateUniformRequest $request, Uniform $uniform)
    {
        $data = $request->validated();
        $original_imported_quantity = $uniform->imported_quantity;


        $uniform->fill($data);

        if ($uniform->imported_quantity > $original_imported_quantity) {
            $quantity_increase = $uniform->imported_quantity - $original_imported_quantity;
            $uniform->available_quantity += $quantity_increase;
        }
        $uniform->save();

        return UniformResource::make($uniform);
    }

    public function index(Request $request)
    {
        $data = $this->baseIndex($request);
        $types = Uniform::where('academic_year', $request->get('academic_year'))
            ->distinct()
            ->pluck('type');
        $data->additional(['types' => $types]);
        return $data;

    }
}
