<?php

namespace App\Http\Middleware;

use App\Exceptions\AuthorizationException;
use Closure;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionException;
use Symfony\Component\HttpFoundation\Response;

class Authorization
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(Request): (Response) $next
     * @throws ReflectionException
     *
     * @throws BindingResolutionException|AuthorizationException
     */
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route();
        $controller = $route->getController();

        $modelClass = null;
        if (property_exists($controller, 'model')) {
            $reflection = new ReflectionClass($controller);
            $property = $reflection->getProperty('model');
            $property->setAccessible(true);
            $modelClass = $property->getValue($controller);
        }

        if ($modelClass) {
            $modelName = Str::plural(Str::kebab(class_basename($modelClass)));

            $action = $this->getActionMapping($route->getActionMethod());
            $permission = "$action $modelName";

            Log::info("Checking permission: $permission for user: " . ($request->user()?->id ?? 'guest'));

            if ($action && $request->user() && !$request->user()->can($permission)) {
                throw new AuthorizationException("انت غير مصرح لك للقيام بهذه العملية");
            }
        }

        return $next($request);
    }

    private function getActionMapping(string $method): ?string
    {
        return match ($method) {
            'index', 'show' => 'view',
            'store' => 'create',
            'update', 'assignRole', 'syncRole' => 'update',
            'destroy', 'removeRole' => 'delete',
            default => null,
        };
    }
}
