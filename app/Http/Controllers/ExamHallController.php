<?php

namespace App\Http\Controllers;

use App\Models\ExamHall;
use Illuminate\Http\Request;
use \App\Traits\HasCRUD;



class ExamHallController extends Controller
{
   use HasCRUD; /**
     * Display a listing of the resource.
     */
    protected string $model = ExamHall::class;
    protected string $storeRequest = \App\Http\Requests\ExamHall\StoreExamHallRequest::class;
    protected string $updateRequest = \App\Http\Requests\ExamHall\UpdateExamHallRequest::class;
    

}  
