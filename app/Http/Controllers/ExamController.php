<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;

class ExamController extends Controller
{
     use hasCRUD;
    protected string $model = Exam::class;
    protected string $storeRequest = \App\Http\Requests\Exam\StoreExamRequest::class;
    protected string $updateRequest = \App\Http\Requests\Exam\UpdateExamRequest::class;
}
