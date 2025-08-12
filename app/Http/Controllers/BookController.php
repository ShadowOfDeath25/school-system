<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\Book;

class BookController extends CRUDController
{
    protected string $model = Book::class;
    protected string $storeRequest = StoreBookRequest::class;
    protected string $updateRequest = UpdateBookRequest::class;
}
