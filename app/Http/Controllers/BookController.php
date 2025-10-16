<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class BookController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'type', 'academic_year', "semester", "level", "language", "grade"
    ];
    protected array $searchable = [
        'type', 'grade', 'level'
    ];
    protected string $model = Book::class;
    protected string $storeRequest = StoreBookRequest::class;
    protected string $updateRequest = UpdateBookRequest::class;
    protected string $resource = BookResource::class;

    public function update(UpdateBookRequest $request, Book $uniform)
    {
        $data = $request->validated();
        $original_imported_quantity = $uniform->imported_quantity;


        $uniform->fill($data);

        if ($uniform->imported_quantity > $original_imported_quantity) {
            $quantity_increase = $uniform->imported_quantity - $original_imported_quantity;
            $uniform->available_quantity += $quantity_increase;
        }
        $uniform->save();

        return BookResource::make($uniform);
    }
}
