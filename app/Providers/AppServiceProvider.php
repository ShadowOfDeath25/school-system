<?php

namespace App\Providers;

use Illuminate\Routing\PendingResourceRegistration;
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
        PendingResourceRegistration::macro('withFilters', function () {
            Route::get($this->name . '/filters', [$this->controller, 'filters'])
                ->name($this->name . '.filters');
            return $this;
        });

        Gate::before(function ($user, $ability) {
            return $user->hasRole("Super Admin") ? true : null;
        });
    }
}
