<?php

namespace App\Http\Controllers;

use App\Http\Requests\Uniform\StoreUniformRequest;
use App\Http\Requests\Uniform\UpdateUniformRequest;
use App\Http\Resources\UniformResource;
use App\Models\Uniform;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class UniformController extends Controller
{
    use HasCRUD, HasFilters;

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

    public function update(UpdateUniformRequest $request, Uniform $book)
    {
        $data = $request->validated();
        $original_imported_quantity = $book->imported_quantity;


        $book->fill($data);

        if ($book->imported_quantity > $original_imported_quantity) {
            $quantity_increase = $book->imported_quantity - $original_imported_quantity;
            $book->available_quantity += $quantity_increase;
        }
        $book->save();

        return UniformResource::make($book);
    }

}
