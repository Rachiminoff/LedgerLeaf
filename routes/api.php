<?php
// routes/api.php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\PocketController;
use Illuminate\Support\Facades\Route;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Budget
    Route::get('/budget/data', [BudgetController::class, 'getData']);
    Route::post('/budget/allocate', [BudgetController::class, 'allocate']);
    Route::post('/budget/transfer', [BudgetController::class, 'transfer']);
    
    // Pockets
    Route::get('/pockets', [PocketController::class, 'index']);
    Route::post('/pockets', [PocketController::class, 'store']);
    Route::put('/pockets/{pocket}', [PocketController::class, 'update']);
    Route::patch('/pockets/{pocket}/archive', [PocketController::class, 'archive']);
    Route::patch('/pockets/{id}/restore', [PocketController::class, 'restore']);
    Route::delete('/pockets/{pocket}', [PocketController::class, 'destroy']);
});