<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * Registers an API resource route along with a supplemental 'filters' endpoint.
         *
         * @param string $name The base name for the resource route (e.g., 'books').
         * @param string $controller The controller class.
         */
        Route::macro("resourceWithFilters", function (string $name, string $controller) {
            Route::get("$name/filters", [$controller, "filters"])->name("$name.filters");
            Route::apiResource($name, $controller);
        });
        Gate::before(function ($user, $ability) {
            return $user->hasRole("Super Admin") ? true : null;
        });
    }
}
