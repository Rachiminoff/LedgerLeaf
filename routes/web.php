<?php

use App\Http\Controllers\AddFundsController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PocketController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SavingsGoalController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
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

// ─── Forgot Password Routes ─────────────────────────────────────

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->middleware('guest')->name('password.request');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::get('/reset-password/{token}', function ($token) {
    return Inertia::render('Auth/ResetPassword', ['token' => $token]);
})->middleware('guest')->name('password.reset');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.update');

// ─── Protected Routes ──────────────────────────────────────────

Route::middleware(['auth'])->group(function () {

    // ───  Help Center ────────────────────────────────────────────
    Route::inertia('/help', 'HelpCenter')->name('help');
    
    // ─── Dashboard ────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ─── Add Funds ─────────────────────────────────────────────
    Route::get('/add-funds', [AddFundsController::class, 'index'])->name('add-funds');
    Route::post('/add-funds', [AddFundsController::class, 'store'])->name('add-funds.store');

    // ─── Profile Routes ────────────────────────────────────────
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::put('/profile/settings', [ProfileController::class, 'updateSettings'])->name('profile.settings.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/statistics', [ProfileController::class, 'getStatistics'])->name('profile.statistics');

    // ─── Budget Planner ────────────────────────────────────────
    Route::get('/budget', function () {
        return Inertia::render('Budget/Index');
    })->name('budget');

    // ─── Categories ─────────────────────────────────────────────
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
        Route::get('/', [ExpenseController::class, 'index'])->name('index');
        Route::get('/archived', function () {
            return Inertia::render('Expenses/Archived');
        })->name('archived');
        Route::get('/create', [ExpenseController::class, 'create'])->name('create');
        Route::post('/', [ExpenseController::class, 'store'])->name('store');
        Route::get('/{expense}', [ExpenseController::class, 'show'])->name('show');
        Route::get('/{expense}/edit', [ExpenseController::class, 'edit'])->name('edit');
        Route::put('/{expense}', [ExpenseController::class, 'update'])->name('update');
        Route::delete('/{expense}', [ExpenseController::class, 'destroy'])->name('destroy');
        Route::patch('/{expense}/archive', [ExpenseController::class, 'archive'])->name('archive');
        Route::patch('/{expense}/restore', [ExpenseController::class, 'restore'])->name('restore');
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
        
        Route::post('/{goal}/add-funds', [SavingsGoalController::class, 'addFunds'])->name('addFunds');
        Route::post('/{goal}/complete', [SavingsGoalController::class, 'complete'])->name('complete');
        Route::post('/{goal}/withdraw', [SavingsGoalController::class, 'withdraw'])->name('withdraw');
        
        Route::patch('/{goal}/archive', [SavingsGoalController::class, 'archive'])->name('archive');
        Route::patch('/{id}/restore', [SavingsGoalController::class, 'restore'])->name('restore');
        
        Route::get('/transactions', [SavingsGoalController::class, 'transactions'])->name('transactions');
    });

    // ─── Reports ──────────────────────────────────────────────────
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/monthly', [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/yearly', [ReportController::class, 'yearly'])->name('yearly');
        Route::get('/category', [ReportController::class, 'category'])->name('category');
        Route::get('/export/csv', [ReportController::class, 'exportCsv'])->name('export.csv');
        Route::get('/export/pdf', [ReportController::class, 'exportPdf'])->name('export.pdf');
        Route::get('/full', [ReportController::class, 'getFullReport'])->name('full');
    });

    // ─── Analytics ──────────────────────────────────────────────────
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [AnalyticsController::class, 'index'])->name('index');
    });

    // ─── Notifications ──────────────────────────────────────────────
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/data', [NotificationController::class, 'getNotifications'])->name('data');
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead'])->name('mark-read');
        Route::put('/{id}/unread', [NotificationController::class, 'markAsUnread'])->name('mark-unread');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::get('/unread-count', [NotificationController::class, 'getUnreadCount'])->name('unread-count');
    });

    // ─── Transactions ─────────────────────────────────────────────
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
    });

    // ─── API Routes ──────────────────────────────────────────────
    Route::prefix('api')->name('api.')->group(function () {
        // Categories
        Route::get('/categories', [CategoryController::class, 'apiIndex'])->name('categories.index');
        
        // Pockets
        Route::get('/pockets', [PocketController::class, 'apiIndex'])->name('pockets.index');
        Route::post('/pockets', [PocketController::class, 'store'])->name('pockets.store');
        Route::put('/pockets/{pocket}', [PocketController::class, 'update'])->name('pockets.update');
        Route::patch('/pockets/{pocket}/archive', [PocketController::class, 'archive'])->name('pockets.archive');
        Route::patch('/pockets/{id}/restore', [PocketController::class, 'restore'])->name('pockets.restore');
        Route::delete('/pockets/{pocket}', [PocketController::class, 'destroy'])->name('pockets.destroy');
        Route::post('/pockets/deduct', [PocketController::class, 'deduct'])->name('pockets.deduct');
        Route::post('/pockets/refund', [PocketController::class, 'refund'])->name('pockets.refund');
        
        // Budget
        Route::get('/budget/data', [BudgetController::class, 'getData'])->name('budget.data');
        Route::post('/budget/allocate', [BudgetController::class, 'allocate'])->name('budget.allocate');
        Route::post('/budget/transfer', [BudgetController::class, 'transfer'])->name('budget.transfer');
        
        // Expenses
        Route::get('/expenses', [ExpenseController::class, 'apiIndex'])->name('expenses.index');
        Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
        Route::patch('/expenses/{expense}/archive', [ExpenseController::class, 'archive'])->name('expenses.archive');
        Route::patch('/expenses/{expense}/restore', [ExpenseController::class, 'restore'])->name('expenses.restore');

        // Transactions
        Route::get('/transactions', [TransactionController::class, 'apiIndex'])->name('transactions.index');

        // Savings Goals
        Route::get('/savings-goals', [SavingsGoalController::class, 'apiIndex'])->name('savings-goals.index');
        Route::post('/savings-goals', [SavingsGoalController::class, 'store'])->name('savings-goals.store');
        Route::put('/savings-goals/{goal}', [SavingsGoalController::class, 'update'])->name('savings-goals.update');
        Route::patch('/savings-goals/{goal}/archive', [SavingsGoalController::class, 'archive'])->name('savings-goals.archive');
        Route::patch('/savings-goals/{id}/restore', [SavingsGoalController::class, 'restore'])->name('savings-goals.restore');
        Route::delete('/savings-goals/{goal}', [SavingsGoalController::class, 'destroy'])->name('savings-goals.destroy');
        Route::post('/savings-goals/{goal}/deposit', [SavingsGoalController::class, 'deposit'])->name('savings-goals.deposit');
        Route::post('/savings-goals/{goal}/withdraw', [SavingsGoalController::class, 'withdraw'])->name('savings-goals.withdraw');
        Route::post('/savings-goals/{goal}/refund', [SavingsGoalController::class, 'refund'])->name('savings-goals.refund');
        Route::get('/savings-goals/transactions', [SavingsGoalController::class, 'transactions'])->name('savings-goals.transactions');

        // Analytics
        Route::get('/analytics/data', [AnalyticsController::class, 'getData'])->name('analytics.data');
        
        // Analytics Export
        Route::get('/analytics/export/{format}', [AnalyticsController::class, 'export'])
            ->name('analytics.export')
            ->where('format', 'pdf|excel|csv');

        // Notifications
        Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])
            ->name('notifications.unread-count');
        
        // Reports
        Route::get('/reports/full', [ReportController::class, 'getFullReport'])->name('reports.full');
    });
    
});

// ─── Authentication Routes ──────────────────────────────────────

require __DIR__.'/auth.php';