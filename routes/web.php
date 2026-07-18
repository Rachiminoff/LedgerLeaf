<?php

use App\Http\Controllers\AddFundsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\PocketController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\SavingsGoalController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Routes ──────────────────────────────────────────────

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/landing', function () {
    return Inertia::render('Landing');
})->name('landing');

// ─── Authentication Routes ──────────────────────────────────────

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/signup', function () {
    return Inertia::render('Auth/Signup');
})->name('signup');

Route::get('/register', function () {
    return redirect()->route('signup');
})->name('register');

// ─── Protected Routes ──────────────────────────────────────────

Route::middleware(['auth'])->group(function () {
    
    // ─── Dashboard ────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ─── Add Funds ─────────────────────────────────────────────
    Route::get('/add-funds', [AddFundsController::class, 'index'])->name('add-funds');
    Route::post('/add-funds', [AddFundsController::class, 'store'])->name('add-funds.store');

    // ─── Profile Routes ────────────────────────────────────────
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─── Categories (Pockets from Wais Wallet) ────────────────
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/create', [CategoryController::class, 'create'])->name('create');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::get('/{category}', [CategoryController::class, 'show'])->name('show');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('edit');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [CategoryController::class, 'reorder'])->name('reorder');
    });

    // ─── Pockets ─────────────────────────────────────────────────
    Route::prefix('pockets')->name('pockets.')->group(function () {
        Route::get('/', [PocketController::class, 'index'])->name('index');
        Route::get('/create', [PocketController::class, 'create'])->name('create');
        Route::post('/', [PocketController::class, 'store'])->name('store');
        Route::get('/{pocket}', [PocketController::class, 'show'])->name('show');
        Route::get('/{pocket}/edit', [PocketController::class, 'edit'])->name('edit');
        Route::put('/{pocket}', [PocketController::class, 'update'])->name('update');
        Route::delete('/{pocket}', [PocketController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [PocketController::class, 'reorder'])->name('reorder');
    });

    // ─── Expenses ────────────────────────────────────────────────
    Route::prefix('expenses')->name('expenses.')->group(function () {
        // Main CRUD
        Route::get('/', [ExpenseController::class, 'index'])->name('index');
        Route::get('/create', [ExpenseController::class, 'create'])->name('create');
        Route::post('/', [ExpenseController::class, 'store'])->name('store');
        Route::get('/{expense}', [ExpenseController::class, 'show'])->name('show');
        Route::get('/{expense}/edit', [ExpenseController::class, 'edit'])->name('edit');
        Route::put('/{expense}', [ExpenseController::class, 'update'])->name('update');
        Route::delete('/{expense}', [ExpenseController::class, 'destroy'])->name('destroy');
        
        // Archive & Restore
        Route::patch('/{expense}/archive', [ExpenseController::class, 'archive'])->name('archive');
        Route::patch('/{expense}/restore', [ExpenseController::class, 'restore'])->name('restore');
        
        // Export
        Route::get('/export', [ExpenseController::class, 'export'])->name('export');
        Route::get('/statistics', [ExpenseController::class, 'statistics'])->name('statistics');
    });

    // ─── Budgets ──────────────────────────────────────────────────
    Route::prefix('budgets')->name('budgets.')->group(function () {
        Route::get('/', [BudgetController::class, 'index'])->name('index');
        Route::post('/', [BudgetController::class, 'store'])->name('store');
        Route::put('/{budget}', [BudgetController::class, 'update'])->name('update');
        Route::delete('/{budget}', [BudgetController::class, 'destroy'])->name('destroy');
        Route::get('/month/{year}/{month}', [BudgetController::class, 'byMonth'])->name('byMonth');
        Route::post('/copy-previous', [BudgetController::class, 'copyPrevious'])->name('copyPrevious');
        Route::get('/utilization', [BudgetController::class, 'utilization'])->name('utilization');
    });

    // ─── Savings Goals ────────────────────────────────────────────
    Route::prefix('savings-goals')->name('savings-goals.')->group(function () {
        Route::get('/', [SavingsGoalController::class, 'index'])->name('index');
        Route::get('/create', [SavingsGoalController::class, 'create'])->name('create');
        Route::post('/', [SavingsGoalController::class, 'store'])->name('store');
        Route::get('/{goal}', [SavingsGoalController::class, 'show'])->name('show');
        Route::get('/{goal}/edit', [SavingsGoalController::class, 'edit'])->name('edit');
        Route::put('/{goal}', [SavingsGoalController::class, 'update'])->name('update');
        Route::delete('/{goal}', [SavingsGoalController::class, 'destroy'])->name('destroy');
        
        // Goal Actions
        Route::post('/{goal}/add-funds', [SavingsGoalController::class, 'addFunds'])->name('addFunds');
        Route::post('/{goal}/complete', [SavingsGoalController::class, 'complete'])->name('complete');
        Route::post('/{goal}/withdraw', [SavingsGoalController::class, 'withdraw'])->name('withdraw');
    });

    // ─── Reports ──────────────────────────────────────────────────
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/monthly', [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/yearly', [ReportController::class, 'yearly'])->name('yearly');
        Route::get('/category', [ReportController::class, 'category'])->name('category');
        Route::get('/export/csv', [ReportController::class, 'exportCsv'])->name('export.csv');
        Route::get('/export/pdf', [ReportController::class, 'exportPdf'])->name('export.pdf');
    });
});

// ─── Authentication Routes ──────────────────────────────────────

require __DIR__.'/auth.php';