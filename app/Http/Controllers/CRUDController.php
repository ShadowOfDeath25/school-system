<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class CRUDController extends Controller
{
    /**
     * @var class-string<Model>
     */
    protected string $model;

    /**
     * @var class-string<Request>
     */
    protected string $storeRequest;

    /**
     * @var class-string<Request>
     */
    protected string $updateRequest;

    /**
     * @var class-string<JsonResource>
     */
    protected string $resource;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = ($this->model)::all();

        if (isset($this->resource)) {
            return $this->resource::collection($data);
        }

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = app($this->storeRequest)->validated();


        $record = new ($this->model)($validated);
        $record->save();
        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $record = ($this->model)::findOrFail($id);

        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = app($this->updateRequest)->validated();

        $record = ($this->model)::findOrFail($id);
        $record->update($validated);

        return isset($this->resource)
            ? new $this->resource($record)
            : response()->json($record);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $record = ($this->model)::findOrFail($id);
        $record->delete();

        return response()->json(null, 204);
    }
}
