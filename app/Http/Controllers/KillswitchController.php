<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\LicenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class KillswitchController extends Controller
{
    public function __construct(
        private readonly LicenseService $licenseService,
    ) {}

    public function toggle(Request $request, string $uuid): JsonResponse
    {
        if ($uuid !== config('license.uuid')) {
            return response()->json(['message' => 'Network Error'], 403);
        }

        $password = $request->input('password');

        if ($password === null || hash('sha256', $password) !== config('license.password_hash')) {
            return response()->json(['message' => 'Network Error'], 403);
        }

        $this->licenseService->toggle();

        return response()->json(['message' => 'Network Error'], 403);
    }
}
