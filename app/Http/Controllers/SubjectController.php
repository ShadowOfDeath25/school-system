<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
    protected string $model = Subject::class;
    protected string $storeRequest = StoreSubjectRequest::class;
    protected string $updateRequest = UpdateSubjectRequest::class;
    protected string $resource = SubjectResource::class;

    public function index(Request $request)
    {
        if ($request->has('types')) {
            return JsonResource::collection(
                Subject::query()
                    ->select('type')
                    ->distinct()
                    ->paginate($request->input('per_page', 30))->withQueryString()
            );
        } else {
            return $this->baseIndex($request);
        }
    }


}
