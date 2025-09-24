<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Models\subject;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;
class SubjectController extends Controller
{
    use HasCRUD;
    protected string $model = subject::class;
    protected string $storeRequest = StoreSubjectRequest::class;
    protected string $updateRequest = UpdateSubjectRequest::class;
}
