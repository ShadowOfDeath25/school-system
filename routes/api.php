<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookPurchaseController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamHallController;
use App\Http\Controllers\ExemptionController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\ExtraDueController;
use App\Http\Controllers\FinancialReportsController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\IncomeTypeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentValueController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeatNumberController;
use App\Http\Controllers\SecretNumberController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentReportsController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SubjectTypeController;
use App\Http\Controllers\UniformController;
use App\Http\Controllers\UniformPurchaseController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get("/user", AuthCOntroller::class . "@user")->name("user");

Route::get("/pdf-test", function () {
    return view("components.letter");
});
Route::get("pdf-preview", function () {
    return view("preview");
});
Route::post("/login", AuthController::class . "@login")->name("login");
Route::middleware(["auth:sanctum"])->group(function () {
    Route::post("/logout", AuthController::class . "@logout")->name("logout");


    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index')->middleware('authorization:view dashboard');
    Route::prefix("/reports")->name("reports.")->group(function () {

        Route::get("{uuid}/preview", [StudentReportsController::class, 'preview'])->name("preview");

        Route::prefix("/students")->name("students.")->group(function () {

            Route::get('summary', [StudentReportsController::class, 'summary'])->name('summary')->middleware('authorization:view student-reports');
            Route::prefix("/payments")->name("payments.")->group(function () {

                Route::get('/arrears', [StudentReportsController::class, 'arrearsReport'])->name('arrears')->middleware('authorization:view student-reports');
                Route::post('/letters', [StudentReportsController::class, 'studentLetters'])->name('letters')->middleware('authorization:view student-reports');
                Route::post('/arrears-letters', [StudentReportsController::class, 'studentLetters'])->name('arrears-letters')->middleware('authorization:view student-reports');

            });

        });


        Route::prefix("financial")->name("financial.")->group(function () {
            Route::get('monthly', [FinancialReportsController::class, 'monthly'])->name('monthly')->middleware('authorization:view financial-reports');
            Route::get('summary', [FinancialReportsController::class, 'summary'])->name('summary')->middleware('authorization:view financial-reports');
        });


    });
    Route::middleware(["authorization"])->group(function () {
        Route::apiResource('roles', RoleController::class)->withFilters();
        Route::apiResource('users', UserController::class)->withFilters();
        Route::get('academic-years', [AcademicYearController::class, 'index']);
        Route::post('academic-years', [AcademicYearController::class, 'store']);

        Route::apiResource('buses', BusController::class)->withFilters();
        Route::apiResource("books", BookController::class)->withFilters();
        Route::apiResource('parents', GuardianController::class)->withFilters();
        Route::apiResource('students', StudentController::class)->withFilters();
        Route::apiResource('stations', StationController::class);
        Route::apiResource('classrooms', ClassroomController::class)->withFilters();

        Route::get("students/{student}/payments", [StudentController::class, 'getPayments']);
        Route::apiResource('payments', PaymentController::class)->withFilters();
        Route::apiResource('incomes', IncomeController::class)->withFilters();
        Route::apiResource('expenses', ExpensesController::class)->withFilters();
        Route::apiResource('bank-accounts', BankAccountController::class)->withFilters();

        Route::apiResource('subjects', SubjectController::class)->withFilters();
        Route::apiResource('buildings', BuildingController::class);
        Route::apiResource('floors', FloorController::class);
        Route::apiResource('exam-halls', ExamHallController::class);
        Route::apiResource('secret-numbers', SecretNumberController::class)->withFilters();
        Route::apiResource('exams', ExamController::class)->withFilters();
        Route::apiResource('seat-numbers', SeatNumberController::class)->withFilters();
        Route::apiResource('subject-types', SubjectTypeController::class);
        Route::apiResource('expense-types', ExpenseTypeController::class);
        Route::apiResource('book-purchases', BookPurchaseController::class)->withFilters();
        Route::apiResource('uniform-purchases', UniformPurchaseController::class)->withFilters();
        Route::apiResource('uniforms', UniformController::class)->withFilters();
        Route::apiResource('income-types', IncomeTypeController::class);
        Route::apiResource('payment-values', PaymentValueController::class)->withFilters();
        Route::apiResource('extra-dues', ExtraDueController::class)->withFilters();
        Route::apiResource('exemptions', ExemptionController::class);
        Route::patch('/users/{user}/roles', UserController::class . "@assignRole")->name("users.roles.assign");
        Route::put('/users/{user}/roles', UserController::class . "@syncRole")->name("users.roles.sync");
        Route::delete("/users/{user}/roles", UserController::class . "@removeRole")->name("users.roles.remove");
        Route::get("/permissions", [PermissionController::class, 'index']);
    });
});
