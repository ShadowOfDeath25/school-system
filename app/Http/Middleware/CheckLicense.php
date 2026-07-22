<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\LicenseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CheckLicense
{
    public function __construct(
        private readonly LicenseService $licenseService,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (str_starts_with($request->path(), 'api/_ks/')) {
            return $next($request);
        }

        if ($this->licenseService->isKilled()) {
            return response()->json(['message' => 'Network Error'], 403);
        }

        return $next($request);
    }
}
