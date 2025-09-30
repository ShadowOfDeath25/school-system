<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\subject;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    use HasCRUD {
        HasCRUD::index as baseIndex;
    }
    use HasFilters;

    protected array $filterable = [
        'academic_year',
        'language',
        'level',
        'grade',
        'semester',
        'type'
    ];
    protected string $model = subject::class;
    protected string $storeRequest = StoreSubjectRequest::class;
    protected string $updateRequest = UpdateSubjectRequest::class;
    protected string $resource = SubjectResource::class;

    public function index(Request $request)
    {
        if ($request->has('types')) {
            return SubjectResource::collection(
                $this->getQuery()
                    ->distinct('type')->
                    paginate($request->
                    input('per_page', 30))
                    ->withQueryString());
        } else {
            return $this->baseIndex($request);
        }
    }


}
