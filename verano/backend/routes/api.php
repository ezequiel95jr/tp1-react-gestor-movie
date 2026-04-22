<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ReportImageController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\StatsController;

    /*
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/nearby', [ReportController::class, 'nearby']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::apiResource('reports', ReportController::class);
    Route::get('/reports-all', [ReportController::class, 'all']);
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('reports', ReportController::class)
            ->except(['index', 'show']);
        Route::post('/reports', [ReportController::class, 'store']);
        Route::post('/reports/{id}/comments', [CommentController::class, 'store']);
        Route::post('/reports/{id}/like', [LikeController::class, 'toggle']);
        Route::post('/reports/{id}/images', [ReportImageController::class, 'store']);
        
    });
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [UserController::class, 'me']);
        Route::put('/me', [UserController::class, 'updateMe']);
        Route::get('/me/reports', [UserController::class, 'myReports']);
        Route::post('/me/avatar', [UserController::class, 'uploadAvatar']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::get('/reports-all', [ReportController::class, 'all']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/user', [UserController::class, 'index']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
});

// Stats routes (admin only)
Route::middleware(['auth:sanctum', 'admin'])->prefix('stats')->group(function () {
    Route::get('/reports-by-month', [StatsController::class, 'reportsByMonth']);
    Route::get('/reports-by-week', [StatsController::class, 'reportsByWeek']);
});





