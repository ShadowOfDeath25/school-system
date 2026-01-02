<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthorizationException extends Exception
{
    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            "error" => "Access denied",
            "message" => $this->getMessage() ?: "انت غير مصرح لك للقيام بهذا "
        ], 403);
    }
}
