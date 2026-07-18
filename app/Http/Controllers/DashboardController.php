<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Pocket;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Force fresh data from database
        $user->refresh();

        // Get data directly from database using raw queries
        $safeBalance = \DB::table('users')
            ->where('id', $user->id)
            ->value('safe_balance') ?? 0;

        $totalBalance = \DB::table('users')
            ->where('id', $user->id)
            ->value('total_balance') ?? 0;

        // If total_balance is 0, calculate from transactions
        if ($totalBalance == 0) {
            $totalBalance = \DB::table('transactions')
                ->where('user_id', $user->id)
                ->selectRaw('SUM(CASE WHEN type = "income" THEN amount WHEN type = "expense" THEN -amount WHEN type = "deposit" THEN amount ELSE 0 END) as total')
                ->value('total') ?? 0;
        }

        // Get allocated to pockets
        $allocatedToPockets = Pocket::where('user_id', $user->id)->sum('current_amount') ?? 0;

        // Monthly spending
        $monthlySpending = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereMonth('date', now()->month)
            ->sum('amount');

        // Active budgets
        $activeBudgets = Budget::where('user_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Pending transactions
        $pendingTransactions = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // Recent activities
        $recentActivities = Transaction::with(['category', 'budget', 'pocket'])
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
                ];
            });

        // Budget categories
        $budgetCategories = \DB::table('budget_categories')
            ->join('categories', 'budget_categories.category_id', '=', 'categories.id')
            ->join('budgets', 'budget_categories.budget_id', '=', 'budgets.id')
            ->where('budgets.user_id', $user->id)
            ->where('budgets.is_active', true)
            ->select(
                'budget_categories.*',
                'categories.name',
                'categories.icon',
                'categories.color',
                'budgets.name as budget_name'
            )
            ->get();

        // Notifications
        $notifications = \DB::table('notifications')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return (array) $notification;
            });

        // Timeline
        $timeline = \DB::table('audit_logs')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return (array) $log;
            });

        // Build stats array
        $stats = [
            'total_balance' => (float) $totalBalance,
            'safe_balance' => (float) $safeBalance,
            'total_savings' => (float) $allocatedToPockets,
            'monthly_spending' => (float) $monthlySpending,
            'active_budgets' => (int) $activeBudgets,
            'pending_transactions' => (int) $pendingTransactions,
        ];

        // Debug log
        \Log::info('Dashboard data:', [
            'user_id' => $user->id,
            'stats' => $stats,
        ]);

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'budgetCategories' => $budgetCategories,
            'notifications' => $notifications,
            'timeline' => $timeline,
            'insights' => $this->generateInsights($user),
        ]);
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
        $safeBalance = \DB::table('users')
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

        return $insights;
    }
}