<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exemption\StoreExemptionRequest;
use App\Http\Requests\Exemption\UpdateExemptionRequest;
use App\Models\Exemption;
use App\Traits\HasCRUD;

class ExemptionController extends Controller
{
    use HasCRUD;

    protected string $model = Exemption::class;
    protected string $storeRequest = StoreExemptionRequest::class;
    protected string $updateRequest = UpdateExemptionRequest::class;
    protected array $searchable = ['type', 'value'];
}
