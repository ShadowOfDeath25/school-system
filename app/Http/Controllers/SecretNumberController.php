<?php

namespace App\Http\Controllers;

use App\Http\Requests\SecretNumber\StoreSecretNumberRequest;
use App\Http\Requests\SecretNumber\UpdateSecretNumberRequest;
use App\Http\Resources\SecretNumberResource;
use App\Models\SecretNumber;
use App\Traits\HasCRUD;
use App\Traits\HasFilters;

class SecretNumberController extends Controller
{
    use HasCRUD, HasFilters;

    protected array $filterable = [
        'academic_year', 'language', 'semester'
    ];
    protected array $searchable = [
        'group_number'
    ];
    protected string $model = SecretNumber::class;
    protected string $storeRequest = StoreSecretNumberRequest::class;
    protected string $updateRequest = UpdateSecretNumberRequest::class;
    protected string $resource = SecretNumberResource::class;

}
