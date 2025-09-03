<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
Route::get('/', function () {
    return view('welcome');
});
// guards/web.php
Route::get('/debug-session', function (Request $request) {
    return response()->json([
        'session_id' => session()->getId(),
        'session_data' => session()->all(),
        'is_authenticated' => auth()->check(),
        'user' => auth()->user(),
        'cookies' => $request->cookies->all(),
    ]);
});
