<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get("/user", AuthCOntroller::class . "@user")->name("user");

Route::post("/login", AuthController::class . "@login")->name("login");
Route::post("/logout", AuthController::class . "@logout")->name("logout")->middleware("auth:sanctum");

Route::apiResource("books", BookController::class)->withFilters();
Route::apiResource('buses', BusController::class);
Route::apiResource('parents', GuardianController::class);
Route::apiResource('students', StudentController::class)->withFilters();
Route::apiResource('payments', PaymentController::class);
Route::apiResource('incomes', IncomeController::class);
Route::apiResource('classrooms', ClassroomController::class);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('expenses', ExpensesController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('users', UserController::class)->withFilters();

Route::patch('/users/{user}/roles', UserController::class . "@assignRole")->name("users.roles.assign");
Route::put('/users/{user}/roles', UserController::class . "@syncRole")->name("users.roles.sync");
Route::delete("/users/{user}/roles", UserController::class . "@removeRole")->name("users.roles.remove");

Route::get("/permissions",[PermissionController::class ,'index']);
