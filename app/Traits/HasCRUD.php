<?php

namespace App\Traits;


use App\Exceptions\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Schema;

trait HasCRUD
{


    public function getQuery(): Builder
    {

        if (method_exists($this, 'query')) {
            return $this->query();
        }
        if (property_exists($this, 'relationsToLoad')) {
            return ($this->model)::query()->with($this->relationsToLoad);
        }
        return ($this->model)::query();

    }


    /**
     * Display a listing of the resource.
     * @throws AuthorizationException
     */
    public function index(Request $request){


        $query = $this->getQuery();


        if ($request->filled('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $searchableFields = property_exists($this, 'searchable') && is_array($this->searchable)
                ? $this->searchable
                : ['name'];

            $query->where(function ($q) use ($searchableFields, $searchTerm) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'like', $searchTerm);
                }
            });
        }
        if (property_exists($this, 'filterable') && !empty($this->filterable)) {
            $modelInstance = new $this->model;
            $tableColumns = Schema::getColumnListing($modelInstance->getTable());

            foreach ($this->filterable as $filterKey) {

                if (str_contains($filterKey, '.')) {
                    [$relation, $column] = explode('.', $filterKey, 2);

                    $requestKey = str_replace('.', '_', $filterKey);

                    if ($request->has($requestKey) && method_exists($modelInstance, $relation)) {
                        $value = $request->input($requestKey);
                        $filterValues = is_array($value) ? $value : [$value];

                        $query->whereHas($relation, function (Builder $q) use ($column, $filterValues, $value) {
                            $value === "null" ?
                                $q->whereNull($column) :
                                $q->whereIn($column, $filterValues);
                        });
                    }

                } elseif ($request->has($filterKey)) {
                    $value = $request->input($filterKey);
                    $filterValues = is_array($value) ? $value : [$value];

                    if (in_array($filterKey, $tableColumns)) {
                        $value === "null" ?
                            $query->whereNull($filterKey) :
                            $query->whereIn($filterKey, $filterValues);
                    } elseif (method_exists($modelInstance, $filterKey)) {
                        $value === "null" ?
                            $query->whereDoesntHave($filterKey) :
                            $query->whereHas($filterKey, fn($q) => $q->whereIn('name', $filterValues));
                    }
                }
            }

        }

        if ($request->boolean('all')) {
            $data = $query->get();
        } else {
            $data = $query->paginate($request->input('per_page', 30))->withQueryString();
        }

        if (property_exists($this, "resource")) {
            return ($this->resource)::collection($data);
        }

        return JsonResource::collection($data);
    }

    /**
     * Store a newly created resource in storage.
     * @throws AuthorizationException
     */
    public function store(Request $request)
    {
        $validated = app($this->storeRequest)->validated();


        $record = new ($this->model)($validated);
        if (class_basename($this->model) === 'User') {
            $record->assignRole($validated["role"]);
        }
        $record->save();
        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record, 201);
    }

    /**
     * Display the specified resource.
     * @throws AuthorizationException
     */
    public function show(string $id)
    {
        $record = $this->getQuery()->findOrFail($id);

        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record);
    }

    /**
     * Update the specified resource in storage.
     * @throws AuthorizationException
     */
    public function update(Request $request, string $id)
    {
        $validated = app($this->updateRequest)->validated();

        $record = ($this->model)::findOrFail($id);
        $record->update($validated);

        if (class_basename($this->model) === 'User' && isset($validated['role'])) {

            $record->syncRoles($validated["role"]);
        }

        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record);
    }

    /**
     * Remove the specified resource from storage.
     * @throws AuthorizationException
     */
    public function destroy(string $id)
    {
        $record = ($this->model)::findOrFail($id);
        $record->delete();

        return response()->json(null, 204);
    }



}
