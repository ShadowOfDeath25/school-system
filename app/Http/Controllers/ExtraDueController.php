<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExtraDue\StoreExtraDueRequest;
use App\Http\Requests\ExtraDue\UpdateExtraDueRequest;
use App\Models\ExtraDue;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class ExtraDueController extends Controller
{
    use HasCRUD, HasFilters;

    protected string $model = ExtraDue::class;
    protected string $storeRequest = StoreExtraDueRequest::class;
    protected string $updateRequest = UpdateExtraDueRequest::class;

}
