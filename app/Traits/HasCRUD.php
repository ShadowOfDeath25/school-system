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


    public function index(Request $request)
    {

        $this->authorizeAction("view");
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
        if (property_exists($this, 'filterable') && is_array($this->filterable) && !empty($this->filterable)) {
            $modelInstance = new $this->model;
            $tableColumns = Schema::getColumnListing($modelInstance->getTable());

            foreach ($this->filterable as $filterKey) {
                if ($request->has($filterKey)) {
                    $value = $request->input($filterKey);
                    $filterValues = is_array($value) ? $value : [$value];
                    if (in_array($filterKey, $tableColumns)) {
                        $query->whereIn($filterKey, $filterValues);
                    } elseif (method_exists($modelInstance, $filterKey)) {
                        $query->whereHas($filterKey, fn($q) => $q->whereIn('name', $filterValues));
                    }
                }
            }
        }

        $data = $query->paginate(30)->withQueryString();
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
        $this->authorizeAction("create");
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
        $this->authorizeAction("view");
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
        $this->authorizeAction("update");
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
        $this->authorizeAction("delete");
        $record = ($this->model)::findOrFail($id);
        $record->delete();

        return response()->json(null, 204);
    }


    /**
     * @throws AuthorizationException
     */
    private function authorizeAction(string $action)
    {
        $modelName = strtolower(class_basename($this->model)) . "s";
        if (!auth()->user()->can("$action $modelName")) {
            throw new AuthorizationException();
        }
    }
}
