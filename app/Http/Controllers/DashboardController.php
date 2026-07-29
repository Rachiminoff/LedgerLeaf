<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Expense;
use App\Models\Pocket;
use App\Models\Budget;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Force fresh data from database
        $user->refresh();

        // Get data directly from database using raw queries
        $safeBalance = DB::table('users')
            ->where('id', $user->id)
            ->value('safe_balance') ?? 0;

        /**
         * TOTAL BALANCE = Safe Balance + Allocated to Pockets
         * This is the total money the user has
         */
        $totalBalance = DB::table('users')
            ->where('id', $user->id)
            ->value('total_balance') ?? 0;

        // If total_balance is 0, calculate from transactions
        if ($totalBalance == 0) {
            $totalBalance = DB::table('transactions')
                ->where('user_id', $user->id)
                ->where('type', 'income')
                ->sum('amount') ?? 0;

            // Update the user's total_balance
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'total_balance' => $totalBalance,
                    'updated_at' => now(),
                ]);
        }

        // Get pockets data
        $pockets = Pocket::where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->where('is_archived', false)
            ->get();

        // Calculate pocket totals
        $allocatedToPockets = $pockets->sum('allocated') ?? 0;
        $spentFromPockets = $pockets->sum('spent') ?? 0;
        $remainingInPockets = $allocatedToPockets - $spentFromPockets;

        // Monthly spending - Use Expense model with proper date handling
        $monthlySpending = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereYear('expense_date', now()->year)
            ->whereMonth('expense_date', now()->month)
            ->sum('amount');

        // Active budgets
        $activeBudgets = Budget::where('user_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Pending transactions
        $pendingTransactions = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // Recent activities - Combine both Transactions and Expenses
        $recentTransactions = Transaction::with(['category', 'budget', 'pocket'])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'category_name' => $transaction->category?->name ?? 'Uncategorized',
                    'category_icon' => $transaction->category?->icon ?? 'mdi:circle',
                    'date' => $transaction->date,
                    'created_at' => $transaction->created_at,
                    'budget_name' => $transaction->budget?->name,
                    'pocket_name' => $transaction->pocket?->name,
                    'source' => 'transaction',
                ];
            });

        $recentExpenses = Expense::with(['category', 'pocket'])
            ->where('user_id', $user->id)
            ->where('is_archived', false)
            ->latest('expense_date')
            ->limit(5)
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'description' => $expense->description ?? $expense->merchant ?? 'Expense',
                    'amount' => $expense->amount,
                    'type' => 'expense',
                    'category_name' => $expense->category?->name ?? 'Uncategorized',
                    'category_icon' => $expense->category?->icon ?? 'mdi:circle',
                    'date' => $expense->expense_date,
                    'created_at' => $expense->created_at,
                    'budget_name' => null,
                    'pocket_name' => $expense->pocket?->name,
                    'source' => 'expense',
                ];
            });

        // Merge and sort recent activities
        $recentActivities = $recentTransactions->concat($recentExpenses)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        // Get budget categories
        $budgetCategories = [];
        
        try {
            if (\Schema::hasTable('budget_categories')) {
                $budgetCategories = DB::table('budget_categories')
                    ->join('categories', 'budget_categories.category_id', '=', 'categories.id')
                    ->join('budgets', 'budget_categories.budget_id', '=', 'budgets.id')
                    ->where('budgets.user_id', $user->id)
                    ->where('budgets.is_active', true)
                    ->select(
                        'budget_categories.id',
                        'categories.name',
                        'categories.icon',
                        'categories.color',
                        'budget_categories.allocated',
                        'budget_categories.spent',
                        'budget_categories.remaining',
                        'budget_categories.budget_id',
                        'budget_categories.category_id',
                        'budgets.name as budget_name'
                    )
                    ->get()
                    ->map(function ($item) {
                        return (array) $item;
                    })
                    ->toArray();
            }
        } catch (\Exception $e) {
            \Log::warning('Budget categories table not found or error: ' . $e->getMessage());
            $budgetCategories = [];
        }

        // If no budget categories found, use pockets as fallback
        if (empty($budgetCategories)) {
            $budgetCategories = $pockets->map(function ($pocket) {
                return [
                    'id' => $pocket->id,
                    'name' => $pocket->name,
                    'icon' => $pocket->icon ?? 'mdi:folder',
                    'color' => $pocket->color ?? '#5CB85C',
                    'allocated' => $pocket->allocated,
                    'spent' => $pocket->spent,
                    'remaining' => $pocket->allocated - $pocket->spent,
                    'budget_id' => 0,
                    'category_id' => $pocket->id,
                    'budget_name' => $pocket->name,
                ];
            })->toArray();
        }

        // Notifications
        $notifications = DB::table('notifications')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return (array) $notification;
            });

        // Timeline
        $timeline = DB::table('audit_logs')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return (array) $log;
            });

        // ─── MONTHLY SPENDING DATA ───────────────────────────────────
        // Get all expenses for the user (for debugging)
        $allExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->select('id', 'amount', 'expense_date', 'description')
            ->orderBy('expense_date')
            ->get();
        
        \Log::info('All user expenses:', $allExpenses->toArray());

        // Get last 12 months of expense data with proper date handling
        $monthlySpendingData = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $year = $month->year;
            $monthNum = $month->month;
            
            // Get expenses for this specific month and year using raw query for reliability
            $amount = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereYear('expense_date', $year)
                ->whereMonth('expense_date', $monthNum)
                ->sum('amount');
            
            // Debug log for each month
            \Log::info('Monthly expense calculation:', [
                'month' => $month->format('M Y'),
                'year' => $year,
                'month_num' => $monthNum,
                'amount' => $amount,
                'user_id' => $user->id,
            ]);
            
            $monthlySpendingData[] = [
                'month' => $month->format('M'),
                'amount' => (float) ($amount ?? 0),
            ];
        }

        // Get current month's expenses for verification
        $currentMonthExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereYear('expense_date', now()->year)
            ->whereMonth('expense_date', now()->month)
            ->get();
        
        \Log::info('Current month expenses:', [
            'month' => now()->format('M Y'),
            'count' => $currentMonthExpenses->count(),
            'total' => $currentMonthExpenses->sum('amount'),
            'expenses' => $currentMonthExpenses->toArray(),
        ]);

        // Build stats array
        $stats = [
            'total_balance' => (float) $totalBalance,
            'safe_balance' => (float) $safeBalance,
            'total_savings' => (float) $allocatedToPockets,
            'monthly_spending' => (float) $monthlySpending,
            'active_budgets' => (int) $activeBudgets,
            'pending_transactions' => (int) $pendingTransactions,
        ];

        // Build budget summary
        $totalPockets = $pockets->count();
        $budgetHealth = $allocatedToPockets > 0 ? ($remainingInPockets / $allocatedToPockets) * 100 : 100;

        $summary = [
            'safe_balance' => (float) $safeBalance,
            'allocated_balance' => (float) $allocatedToPockets,
            'remaining_balance' => (float) $remainingInPockets,
            'monthly_budget' => (float) $allocatedToPockets,
            'total_pockets' => (int) $totalPockets,
            'budget_health' => min(max($budgetHealth, 0), 100),
            'budget_health_label' => $this->getHealthLabel($budgetHealth),
        ];

        // Debug log
        \Log::info('Dashboard data:', [
            'user_id' => $user->id,
            'safe_balance' => $safeBalance,
            'total_balance' => $totalBalance,
            'allocated_to_pockets' => $allocatedToPockets,
            'spent_from_pockets' => $spentFromPockets,
            'total_pockets' => $totalPockets,
            'monthly_spending_data' => $monthlySpendingData,
            'all_expenses_total' => Expense::where('user_id', $user->id)->where('is_archived', false)->sum('amount'),
        ]);

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => $stats,
            'summary' => $summary,
            'recentActivities' => $recentActivities,
            'budgetCategories' => $budgetCategories,
            'notifications' => $notifications,
            'timeline' => $timeline,
            'insights' => $this->generateInsights($user),
            'monthlySpendingData' => $monthlySpendingData,
        ]);
    }

    private function getHealthLabel(float $health): string
    {
        if ($health >= 90) return 'Excellent';
        if ($health >= 70) return 'Good';
        if ($health >= 50) return 'Fair';
        if ($health >= 30) return 'Needs Attention';
        return 'Critical';
    }

    private function generateInsights($user)
    {
        $insights = [];

        // Budget insights
        $budgets = Budget::where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        foreach ($budgets as $budget) {
            if ($budget->amount > 0) {
                $spentPercentage = ($budget->spent / $budget->amount) * 100;
                if ($spentPercentage > 90) {
                    $insights[] = [
                        'id' => count($insights) + 1,
                        'message' => "Your \"{$budget->name}\" budget is at " . round($spentPercentage) . "% - you're almost over budget!",
                        'icon' => 'mdi:alert-circle',
                        'type' => 'warning',
                    ];
                }
            }
        }

        // Safe balance insight
        $safeBalance = DB::table('users')
            ->where('id', $user->id)
            ->value('safe_balance') ?? 0;
            
        if ($safeBalance > 0) {
            $insights[] = [
                'id' => count($insights) + 1,
                'message' => "You have ₱" . number_format($safeBalance, 2) . " in safe balance. Consider allocating to pockets!",
                'icon' => 'mdi:wallet',
                'type' => 'positive',
            ];
        }

        // Total balance insight
        $totalBalance = DB::table('users')
            ->where('id', $user->id)
            ->value('total_balance') ?? 0;

        if ($totalBalance > 0) {
            $insights[] = [
                'id' => count($insights) + 1,
                'message' => "Your total balance is ₱" . number_format($totalBalance, 2) . ". Keep up the good work!",
                'icon' => 'mdi:chart-line',
                'type' => 'positive',
            ];
        }

        // Pocket insights
        $pockets = Pocket::where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->where('is_archived', false)
            ->get();

        foreach ($pockets as $pocket) {
            if ($pocket->allocated > 0) {
                $usage = ($pocket->spent / $pocket->allocated) * 100;
                if ($usage > 90) {
                    $insights[] = [
                        'id' => count($insights) + 1,
                        'message' => "Your \"{$pocket->name}\" pocket is at " . round($usage) . "% usage - consider refilling!",
                        'icon' => 'mdi:alert-circle',
                        'type' => 'warning',
                    ];
                } elseif ($usage < 10 && $pocket->allocated > 0) {
                    $insights[] = [
                        'id' => count($insights) + 1,
                        'message' => "Your \"{$pocket->name}\" pocket has only been used " . round($usage) . "% - you might have over-allocated!",
                        'icon' => 'mdi:lightbulb',
                        'type' => 'neutral',
                    ];
                }
            }
        }

        // If no insights, add a default positive one
        if (empty($insights)) {
            $insights[] = [
                'id' => 1,
                'message' => "Your finances are looking great! Keep up the good work!",
                'icon' => 'mdi:star',
                'type' => 'positive',
            ];
        }

        return $insights;
    }
}