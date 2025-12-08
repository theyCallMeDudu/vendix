<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel!',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});
// depois envolver com middleware de autenticação
Route::get('/products', [ProductController::class, 'getProducts']);
Route::post('/products', [ProductController::class, 'saveProduct']);
Route::get('/products/{product}', [ProductController::class, 'getProduct']);
Route::put('products/{product}', [ProductController::class, 'updateProduct']);
Route::get('/categories', [ProductCategoryController::class, 'getCategories']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
