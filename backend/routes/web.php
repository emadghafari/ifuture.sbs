<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



// Fallback route for storage files when running via `artisan serve` on Windows
Route::get('storage/{path}', function ($path) {
    try {
        $fullPath = storage_path("app/public/" . str_replace('/', DIRECTORY_SEPARATOR, $path));
        if (file_exists($fullPath)) {
            $mime = \Illuminate\Support\Facades\File::mimeType($fullPath);
            // using download instead of file to avoid symfony AccessDenied exceptions on windows
            return response()->download($fullPath, basename($fullPath), ['Content-Type' => $mime], 'inline');
        }
    }
    catch (\Exception $e) {
        return response($e->getMessage(), 500);
    }
    abort(404);
})->where('path', '.*');

Route::get('files/{path}', function ($path) {
    try {
        $fullPath = storage_path("app/public/" . str_replace('/', DIRECTORY_SEPARATOR, $path));
        if (file_exists($fullPath)) {
            $mime = \Illuminate\Support\Facades\File::mimeType($fullPath);
            return response()->file($fullPath, ['Content-Type' => $mime]);
        }
    }
    catch (\Exception $e) {
        return response($e->getMessage(), 500);
    }
    abort(404);
})->where('path', '.*');
