<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $maintenanceMode = \App\Models\Setting::where('key', 'maintenance_mode')->first()->value ?? 'off';

        if ($maintenanceMode === 'on') {
            $path = $request->path();

            // Always allow auth routes to let the controller decide (we handle non-admin rejection there)
            if ($request->is('api/login') || $request->is('api/logout') || $request->is('api/register') || $request->is('login') || $request->is('logout') || $request->is('register')) {
                return $next($request);
            }

            // Allow authenticated admins for any route
            $user = $request->user('sanctum');
            if ($user && $user->role === 'admin') {
                return $next($request);
            }

            // Also allow the stats call if it's for checking maintenance status (optional, but let's stick to blocking)

            return response()->json([
                'message' => 'System is currently under maintenance. Please try again later.',
                'maintenance' => true
            ], 503);
        }

        return $next($request);
    }
}
