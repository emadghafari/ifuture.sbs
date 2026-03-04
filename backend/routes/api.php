<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectStageController;
use App\Http\Controllers\Admin\InvestmentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\InvestorController;
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
    Route::get('projects', [PublicController::class , 'getProjects']);
    Route::get('projects/{slug}', [PublicController::class , 'getProject']);
    Route::post('contact', [PublicController::class , 'postContact']);

    Route::get('run-migrations', function () {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            return 'Migrations executed successfully!';
        }
        );

        Route::get('read-logs', function () {
            $logPath = storage_path('logs/laravel.log');
            if (!file_exists($logPath))
                return 'No logs found.';
            $content = file_get_contents($logPath);
            // return last 10000 chars to avoid memory issues
            return response(substr($content, -10000))->header('Content-Type', 'text/plain');
        }
        );

        Route::get('run-demo-seeder', function () {
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'DemoProjectSeeder', '--force' => true]);
            return 'Demo Project & Investor Seeded Successfully! Login with: investor@test.com / password123';
        }
        );

        Route::get('seed-settings', function () {
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'SettingSeeder', '--force' => true]);
            return 'Settings Seeded Successfully!';
        }
        );
    });

Route::middleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class])->group(function () {
    // Admin Auth
    Route::prefix('auth')->group(function () {
            Route::post('register', [AuthController::class , 'register']);
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
            Route::post('payment/stripe/intent', [PaymentController::class , 'createStripeIntent']);
            Route::post('payment/capture', [PaymentController::class , 'captureInvestment']);

            Route::get('messages', [MessageController::class , 'index']);
            Route::get('settings', [SettingController::class , 'index']);
            Route::put('settings', [SettingController::class , 'update']);
            Route::post('settings/logo', [SettingController::class , 'uploadLogo']);
            Route::post('settings/og-image', [SettingController::class , 'uploadOgImage']);
            Route::post('settings/favicon', [SettingController::class , 'uploadFavicon']);
        }
        );

        // Investor Protected Routes
        Route::prefix('investor')->middleware('auth:sanctum')->group(function () {
            Route::get('investments', [InvestorController::class , 'getInvestments']);
        }
        );
    });
