<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Models\Book;
use App\Traits\HasCRUD;

class BookController
{
    use HasCRUD;

    protected string $model = Book::class;
    protected string $storeRequest = StoreBookRequest::class;
    protected string $updateRequest = UpdateBookRequest::class;
}
