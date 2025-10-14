<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookPurchase\StoreBookPurchaseRequest;
use App\Http\Requests\BookPurchase\UpdateBookPurchaseRequest;
use App\Http\Resources\BookPurchaseResource;
use App\Models\Book;
use App\Models\BookPurchase;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class BookPurchaseController extends Controller
{
    use HasCRUD {
        store as baseStore;
    }
    use HasFilters;


    protected string $model = BookPurchase::class;
    protected string $storeRequest = StoreBookPurchaseRequest::class;
    protected string $updateRequest = UpdateBookPurchaseRequest::class;
    protected string $resource = BookPurchaseResource::class;
    protected array $relationsToLoad = [
        'book'
    ];
    protected array $filterable = [
        'book.academic_year',
        'book.semester',
        "book.language",
        "book.type",
        "book.level",
        "book.grade",
    ];

    public function store(StoreBookPurchaseRequest $request)
    {
        $data = $request->validated();
        $book = Book::findOrFail($data['book_id']);

        if ($book->available_quantity < $data['quantity']) {
            return response()->json(["message" => $book->available_quantity === 0 ? "نفذت كمية هذه النسخة" : 'هذه الكمية غير متاحة'], 409);
        }
        $book->available_quantity -= 1;
        $book->save();
        return $this->baseStore($request);

    }

}
