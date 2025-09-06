<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;

trait HasFilters
{

    public function getFilterOptions(): JsonResponse
    {
        $data = [];
        if (property_exists($this, 'filterable') && is_array($this->filterable) && !empty($this->filterable)) {
            $modelInstance = new $this->model;
            $tableColumns = Schema::getColumnListing($modelInstance->getTable());

            foreach ($this->filterable as $filter) {
                if (in_array($filter, $tableColumns)) {
                    $data[$filter] = ($this->model)::query()
                        ->distinct()
                        ->whereNotNull($filter)
                        ->orderBy($filter)
                        ->pluck($filter);
                } elseif (method_exists($modelInstance, $filter)) {
                    $relation = $modelInstance->$filter();
                    $relatedModel = $relation->getRelated();

                    if (Schema::hasColumn($relatedModel->getTable(), 'name')) {
                        $data[$filter] = $relatedModel::query()
                            ->distinct()
                            ->whereNotNull('name')
                            ->orderBy('name')
                            ->pluck('name');
                    }
                }
            }
        }
        return response()->json($data);
    }
}
