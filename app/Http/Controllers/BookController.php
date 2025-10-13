<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\JsonResource;

class BookController extends Controller
{
    use HasCRUD {
        index as baseIndex;
    }
    use  HasFilters;

    protected array $filterable = [
        'type', 'academic_year', "semester", "level", "language", "grade"
    ];
    protected string $model = Book::class;
    protected string $storeRequest = StoreBookRequest::class;
    protected string $updateRequest = UpdateBookRequest::class;
    protected string $resource = BookResource::class;



}
