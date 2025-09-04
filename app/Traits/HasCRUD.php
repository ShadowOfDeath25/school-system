<?php

namespace App\Traits;

use App\Exceptions\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

trait HasCRUD
{


    /**
     * Display a listing of the resource.
     * @throws AuthorizationException
     */

    public function index(Request $request)
    {

        $this->authorizeAction("view");
        $query = ($this->model)::query();


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
                    if (in_array($filterKey, $tableColumns)) {
                        $query->where($filterKey, $value);
                    } elseif (method_exists($modelInstance, $filterKey)) {
                        $query->whereHas($filterKey, fn($q) => $q->where('name', $value));
                    }
                }
            }
        }

        $data = $query->paginate(30)->withQueryString();

        if (isset($this->resource)) {
            $collection = $this->resource::collection($data);
            if (method_exists($this, 'getFilterOptions')) {
                $filterOptions = $this->getFilterOptions();
                if (!empty($filterOptions)) {
                    return $collection->additional(['meta' => ['filter_options' => $filterOptions]]);
                }
            }
            return $collection;
        }

        return response()->json($data);
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
        $record = ($this->model)::findOrFail($id);

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
        $requestClass = $this->storeRequest;
        $rules = (new $requestClass())->rules();
        $validated = validator(request()->all(), $rules)->validate();


        $record = ($this->model)::findOrFail($id);
        $record->update($validated);

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
     * Provides an array of options for frontend filters.
     * Can be overridden by controllers to provide specific filter data.
     *
     * @return array
     */
    protected function getFilterOptions(): array
    {
        return [];
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
