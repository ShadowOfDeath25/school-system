<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exam\StoreExamRequest;
use App\Http\Requests\Exam\UpdateExamRequest;
use App\Models\Exam;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;

class ExamController extends Controller
{
     use hasCRUD;
    protected string $model = Exam::class;
    protected string $storeRequest = StoreExamRequest::class;
    protected string $updateRequest = UpdateExamRequest::class;
}
