<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamHall\StoreExamHallRequest;
use App\Models\ExamHall;
use Illuminate\Http\Request;
use App\Traits\HasCRUD;



class ExamHallController extends Controller
{
   use HasCRUD;
    protected string $model = ExamHall::class;
    protected string $storeRequest = StoreExamHallRequest::class;
    protected string $updateRequest = \App\Http\Requests\ExamHall\UpdateExamHallRequest::class;


}
