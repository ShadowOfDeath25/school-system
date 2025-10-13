<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookPurchase\StoreBookPurchaseRequest;
use App\Http\Requests\BookPurchase\UpdateBookPurchaseRequest;
use App\Models\BookPurchase;
use App\Traits\HasCRUD;

class BookPurchaseController extends Controller
{
    use HasCRUD;

    protected string $model = BookPurchase::class;
    protected string $storeRequest = StoreBookPurchaseRequest::class;
    protected string $updateRequest = UpdateBookPurchaseRequest::class;

}
