<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Logged in successfully',
                'user' => Auth::user(),
                'auth_check' => Auth::check(),
                'session_all' => session()->all(),
                'session_id' => session()->getId()
            ]);
        }

        return response()->json([
            'message' => 'Incorrect email or password'
        ], 422);
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}
