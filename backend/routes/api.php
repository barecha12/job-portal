<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{id}', [CompanyController::class, 'show']);
Route::get('/stats', [\App\Http\Controllers\Api\StatsController::class, 'landingPageStats']);

// Protected Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Company & Job Management (Employer Only)
    Route::group(['middleware' => ['role:employer']], function () {
        Route::get('/employer/companies', [CompanyController::class, 'myCompanies']);
        Route::post('/companies', [CompanyController::class, 'store']);
        Route::put('/companies/{id}', [CompanyController::class, 'update']);
        Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);

        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

        Route::get('/employer/applications', [ApplicationController::class, 'index']);
        Route::put('/applications/{id}', [ApplicationController::class, 'update']); // Status update
    });

    // Application Management (Seeker Only)
    Route::group(['middleware' => ['role:seeker']], function () {
        Route::post('/applications', [ApplicationController::class, 'store']);
        Route::get('/my-applications', [ApplicationController::class, 'index']); // I might need to update this to separate seeker/employer apps better
    });

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);

    Route::get('/user', [ProfileController::class, 'show']);
    Route::post('/user', [ProfileController::class, 'update']);
    Route::get('/dashboard-stats', [\App\Http\Controllers\DashboardController::class, 'stats']);

    // Admin Routes
    Route::group(['middleware' => ['role:admin'], 'prefix' => 'admin'], function () {
        Route::get('/stats', [\App\Http\Controllers\AdminController::class, 'getStats']);
        Route::get('/analytics', [\App\Http\Controllers\AdminController::class, 'getAnalytics']);
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'listUsers']);
        Route::delete('/users/{id}', [\App\Http\Controllers\AdminController::class, 'deleteUser']);
        Route::get('/jobs', [\App\Http\Controllers\AdminController::class, 'listJobs']);
        Route::patch('/jobs/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateJobStatus']);
        Route::delete('/jobs/{id}', [\App\Http\Controllers\AdminController::class, 'deleteJob']);
        Route::get('/companies', [\App\Http\Controllers\AdminController::class, 'listCompanies']);
        Route::delete('/companies/{id}', [\App\Http\Controllers\AdminController::class, 'deleteCompany']);
        Route::get('/applications', [\App\Http\Controllers\AdminController::class, 'listApplications']);
        Route::delete('/applications/{id}', [\App\Http\Controllers\AdminController::class, 'deleteApplication']);
        Route::get('/activities', [\App\Http\Controllers\AdminController::class, 'getActivityLogs']);
        Route::get('/performance', [\App\Http\Controllers\AdminController::class, 'getPerformanceMetrics']);
        Route::post('/maintenance', [\App\Http\Controllers\AdminController::class, 'toggleMaintenance']);
    });
});
