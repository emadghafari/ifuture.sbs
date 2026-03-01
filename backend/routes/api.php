<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectStageController;
use App\Http\Controllers\Admin\InvestmentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::get('test-sanctum', function (\Illuminate\Http\Request $request) {
    return [
    'fromFrontend' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::fromFrontend($request),
    'referer' => $request->headers->get('referer'),
    'origin' => $request->headers->get('origin'),
    'stateful_domains' => config('sanctum.stateful'),
    ];
});

// Public Routes
Route::prefix('public')->group(function () {
    Route::get('home', [PublicController::class , 'getHome']);
    Route::get('seo', [PublicController::class , 'getSeo']);
    Route::post('contact', [PublicController::class , 'postContact']);
    Route::get('seed-settings', function () {
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'SettingSeeder']);
            return 'Settings Seeded Successfully!';
        }
        );
    });

Route::middleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class])->group(function () {
    // Admin Auth
    Route::prefix('auth')->group(function () {
            Route::post('login', [AuthController::class , 'login']);
            Route::post('logout', [AuthController::class , 'logout'])->middleware('auth:sanctum');
            Route::get('user', [AuthController::class , 'user'])->middleware('auth:sanctum');
        }
        );

        // Admin CRUD (Protected by Sanctum)
        Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
            Route::get('dashboard/stats', [\App\Http\Controllers\Admin\DashboardController::class , 'stats']);
            Route::apiResource('products', ProductController::class)->except(['update']);
            Route::post('products/{product}', [ProductController::class , 'update']);
            Route::apiResource('team', TeamController::class)->except(['update']);
            Route::post('team/{team}', [TeamController::class , 'update']);

            Route::apiResource('projects', ProjectController::class)->except(['update']);
            Route::post('projects/{project}', [ProjectController::class , 'update']);
            Route::apiResource('stages', ProjectStageController::class);
            Route::apiResource('investments', InvestmentController::class)->only(['index', 'show']);

            // Payments (Requires investor login)
            Route::post('payment/stripe/intent', [PaymentController::class, 'createStripeIntent']);
            Route::post('payment/capture', [PaymentController::class, 'captureInvestment']);

            Route::get('messages', [MessageController::class , 'index']);
            Route::get('settings', [SettingController::class , 'index']);
            Route::put('settings', [SettingController::class , 'update']);
            Route::post('settings/logo', [SettingController::class , 'uploadLogo']);
            Route::post('settings/og-image', [SettingController::class , 'uploadOgImage']);
            Route::post('settings/favicon', [SettingController::class , 'uploadFavicon']);        }
        );    });
