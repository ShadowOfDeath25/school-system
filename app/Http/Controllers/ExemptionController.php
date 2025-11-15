<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exemption\StoreExemptionRequest;
use App\Http\Requests\Exemption\UpdateExemptionRequest;
use App\Models\Exemption;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class ExemptionController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = Exemption::class;
    protected string $storeRequest = StoreExemptionRequest::class;
    protected string $updateRequest = UpdateExemptionRequest::class;
    protected array $searchable = ['type', 'value'];
    protected array $filterable = [
        'type',
    ];
}
