<?php

namespace App\Traits;

use App\Exceptions\AuthorizationException;
use Illuminate\Http\Request;

trait HasCRUD
{


    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {

        $this->authorizeAction("view");
        $data = ($this->model)::paginate(10);

        if (isset($this->resource)) {
            return $this->resource::collection($data);
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
        if (class_basename($this->model)==='User'){
            $record->assignRole("مستخدم");
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
