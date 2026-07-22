<?php

use App\Http\Middleware\Authorization;
use App\Http\Middleware\CheckLicense;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . "/../routes/web.php",
        api: __DIR__ . "/../routes/api.php",
        commands: __DIR__ . "/../routes/console.php",
        health: "/up",
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: "*");
        $middleware->redirectGuestsTo(fn() => config("app.frontend_url"));
        $middleware->statefulApi();
        $middleware->api(prepend: [
            CheckLicense::class,
        ]);
        $middleware->alias([
            "authorization" => Authorization::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'api/_ks/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
