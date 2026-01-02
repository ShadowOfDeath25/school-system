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
     * @param Request $request
     * @param Closure $next
     * @param string|null $permission
     * @return Response
     * @throws ReflectionException
     * @throws AuthorizationException
     */
    public function handle(Request $request, Closure $next, ?string $permission = null): Response
    {
        // 1. Check if permission is passed as a middleware parameter
        if ($permission) {
            if ($request->user() && !$request->user()->can($permission)) {
                throw new AuthorizationException("انت غير مصرح لك للقيام بهذه العملية");
            }
            return $next($request);
        }

        $route = $request->route();
        $controller = $route->getController();

        // 2. Check for $permission property on controller
        if (property_exists($controller, 'permission')) {
            $reflection = new ReflectionClass($controller);
            $property = $reflection->getProperty('permission');
            $property->setAccessible(true);
            $permission = $property->getValue($controller);

            if ($permission && $request->user() && !$request->user()->can($permission)) {
                throw new AuthorizationException("انت غير مصرح لك للقيام بهذه العملية");
            }
            return $next($request);
        }

        // 3. Falling back to dynamic model-based logic
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
