<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanViewStats
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->user()?->role;

        if (!in_array($role, ['admin', 'stats'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
