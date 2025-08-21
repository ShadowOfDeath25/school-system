<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::apiResource('books', BookController::class);
Route::apiResource('buses', BusController::class);
Route::apiResource('parents', StudentParentController::class);
Route::apiResource('students', StudentController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('incomes', IncomeController::class);
Route::apiResource('classes', ClassController::class);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('expenses', ExpensesController::class);


