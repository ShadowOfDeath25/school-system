<?php

namespace App\Http\Controllers;

use App\Models\subject;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;
class SubjectController extends Controller
{
    use HasCRUD;
    protected string $model = subject::class;
    protected string $storeRequest = \App\Http\Requests\Subject\StoreSubjectRequest::class;
    protected string $updateRequest = \App\Http\Requests\Subject\UpdateSubjectRequest::class;
}
