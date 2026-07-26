<?php

namespace App\Http\Controllers;

use App\Models\NoteType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;

class NoteTypeController extends Controller
{
    protected string $model = NoteType::class;

    protected array $searchable = ['name'];

    public function index(Request $request)
    {
        if ($request->boolean('all') || $request->boolean('activeOnly')) {
            $data = NoteType::active()->get();
            return JsonResource::collection($data);
        }

        $query = NoteType::query();
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $query->where('name', 'like', $searchTerm);
        }
        $data = $query->paginate($request->input('per_page', 30))->withQueryString();
        return JsonResource::collection($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('note_types')],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $record = NoteType::create($validated);
        return response()->json($record, 201);
    }

    public function update(Request $request, string $id)
    {
        $record = NoteType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('note_types')->ignore($id)],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $record->update($validated);
        return response()->json($record);
    }

    public function destroy(string $id)
    {
        $record = NoteType::findOrFail($id);
        $record->delete();
        return response()->json(null, 204);
    }

    public function show(string $id)
    {
        $record = NoteType::findOrFail($id);
        return response()->json($record);
    }
}
