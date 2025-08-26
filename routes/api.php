<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::get('/user', function (Request $request) {
    return response()->json(["user" => $request->user()]);
});

Route::post("/login", AuthController::class . "@login")->name("login");
Route::post("/logout", AuthController::class . "@logout")->name("logout")->middleware("auth:sanctum");

Route::apiResource('books', BookController::class);
Route::apiResource('buses', BusController::class);
Route::apiResource('parents', StudentParentController::class);
Route::apiResource('students', StudentController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('incomes', IncomeController::class);
Route::apiResource('classes', ClassController::class);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('expenses', ExpensesController::class);
Route::apiResource('users', UserController::class);


