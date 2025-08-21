<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HasCRUD;
use App\Http\Requests\Class\StoreClassRequest;
use App\Http\Requests\Class\UpdateClassRequest;
use App\Models\claassModel; // Assuming the model is named ClassModel

class ClassController extends Controller
{
     use HasCRUD;
    protected string $model = claass::class;
    protected string $storeRequest = StoreClassRequest::class;
    protected string $updateRequest = UpdateClassRequest::class;


}
