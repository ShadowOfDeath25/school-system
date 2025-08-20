<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Models\Student;
use App\Traits\HasCRUD;

class StudentController
{
    use HasCRUD;

    protected string $model = Student::class;
    protected string $storeRequest = StoreStudentRequest::class;
    protected string $updateRequest = UpdateStudentRequest::class;
}

