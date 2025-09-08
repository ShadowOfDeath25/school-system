<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        //TODO: handle multiple logins
        $credentials = $request->only('email', 'password');
        $remember = $request->filled("remember");
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Logged in successfully',
                'user' => UserResource::make(Auth::user()),

            ]);
        }

        return response()->json([
            'message' => 'خطأ في البريد الإلكتروني او كلمة السر'
        ], 422);
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        //todo change the way this is handled
        if ($request->headers->get("referer") == null) {
            return redirect(env("FRONTEND_URL"));
        }
        if ($request->user()) {
            return response()->json(["user" => UserResource::make($request->user())]);
        }
        return response()->json(["user" => null]);
    }
}
