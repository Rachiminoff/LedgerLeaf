<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Notification;
use App\Models\Pocket;
use App\Models\SavingsGoal;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Generate all notifications for a user.
     *
     * @param User $user
     * @return void
     */
    public function generateAllNotifications(User $user): void
    {
        $this->generateBudgetAlerts($user);
        $this->generateSavingsMilestones($user);
        $this->generateFinancialInsights($user);
        $this->generateMonthlySummary($user);
    }

    /**
     * Generate budget alerts.
     *
     * @param User $user
     * @return void
     */
    public function generateBudgetAlerts(User $user): void
    {
        $pockets = Pocket::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereNull('deleted_at')
            ->get();

        $currentMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        foreach ($pockets as $pocket) {
            // Calculate spending for this pocket this month
            $spent = Expense::where('user_id', $user->id)
                ->where('pocket_id', $pocket->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$currentMonth, $endOfMonth])
                ->sum('amount');

            // Check if pocket has a budget
            if ($pocket->budget_amount > 0) {
                $percentage = ($spent / $pocket->budget_amount) * 100;

                // Alert at 90%
                if ($percentage >= 90 && $percentage < 100) {
                    $this->createNotification(
                        $user->id,
                        'budget',
                        'Budget Alert',
                        "Your \"{$pocket->name}\" pocket has reached " . round($percentage) . "% of its monthly budget.",
                        ['pocket_id' => $pocket->id, 'percentage' => round($percentage)]
                    );
                }

                // Alert at 100%
                if ($percentage >= 100) {
                    $this->createNotification(
                        $user->id,
                        'budget',
                        'Budget Exceeded',
                        "Your \"{$pocket->name}\" pocket has exceeded its monthly budget.",
                        ['pocket_id' => $pocket->id, 'percentage' => round($percentage)]
                    );
                }
            }

            // Check for unallocated funds (safe balance)
            if ($user->safe_balance > 1000 && !$this->notificationExists($user->id, 'budget', 'unallocated_funds')) {
                $this->createNotification(
                    $user->id,
                    'budget',
                    'Unallocated Funds Available',
                    "You have ₱" . number_format($user->safe_balance, 2) . " in unallocated funds. Consider allocating them to your pockets.",
                    ['safe_balance' => $user->safe_balance]
                );
            }
        }
    }

    /**
     * Generate savings milestones.
     *
     * @param User $user
     * @return void
     */
    public function generateSavingsMilestones(User $user): void
    {
        $goals = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->get();

        $milestones = [25, 50, 75, 100];

        foreach ($goals as $goal) {
            if ($goal->target_amount > 0) {
                $percentage = ($goal->current_amount / $goal->target_amount) * 100;

                // Check if goal was just completed
                if ($percentage >= 100 && !$this->notificationExists($user->id, 'savings', 'goal_completed_' . $goal->id)) {
                    $this->createNotification(
                        $user->id,
                        'savings',
                        'Goal Completed',
                        "Congratulations! You've completed your \"{$goal->name}\" savings goal!",
                        ['goal_id' => $goal->id, 'percentage' => 100]
                    );
                    continue;
                }

                // Check for milestone achievements
                foreach ($milestones as $milestone) {
                    if ($percentage >= $milestone && !$this->notificationExists($user->id, 'savings', 'milestone_' . $goal->id . '_' . $milestone)) {
                        $this->createNotification(
                            $user->id,
                            'savings',
                            'Savings Milestone',
                            "Your \"{$goal->name}\" savings goal has reached {$milestone}%! You've saved ₱" . number_format($goal->current_amount, 2) . " of ₱" . number_format($goal->target_amount, 2) . ".",
                            ['goal_id' => $goal->id, 'percentage' => $milestone]
                        );
                        break; // Only trigger one milestone per check
                    }
                }
            }
        }
    }

    /**
     * Generate financial insights from analytics.
     *
     * @param User $user
     * @return void
     */
    public function generateFinancialInsights(User $user): void
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        // Get current month expenses
        $currentExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$currentMonth, $endOfMonth])
            ->sum('amount');

        // Get last month expenses
        $lastMonthStart = $lastMonth->copy()->startOfMonth();
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();
        $lastMonthExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$lastMonthStart, $lastMonthEnd])
            ->sum('amount');

        // Spending trend insight
        if ($lastMonthExpenses > 0) {
            $change = (($currentExpenses - $lastMonthExpenses) / $lastMonthExpenses) * 100;
            $direction = $change < 0 ? 'less' : 'more';

            if (abs($change) >= 5) {
                $this->createNotification(
                    $user->id,
                    'insight',
                    'Spending Trend',
                    "You spent " . abs(round($change, 1)) . "% {$direction} this month compared to last month.",
                    ['change' => round($change, 1), 'direction' => $direction]
                );
            }
        }

        // Find top spending category
        $topPocket = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$currentMonth, $endOfMonth])
            ->selectRaw('pocket_id, SUM(amount) as total')
            ->groupBy('pocket_id')
            ->orderBy('total', 'desc')
            ->first();

        if ($topPocket) {
            $pocket = Pocket::find($topPocket->pocket_id);
            if ($pocket) {
                $this->createNotification(
                    $user->id,
                    'insight',
                    'Top Spending Category',
                    "Your largest expense category this month is \"{$pocket->name}\".",
                    ['pocket_id' => $pocket->id]
                );
            }
        }
    }

    /**
     * Generate monthly summary.
     *
     * @param User $user
     * @return void
     */
    public function generateMonthlySummary(User $user): void
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        // Check if we already sent a monthly summary this month
        if ($this->notificationExists($user->id, 'monthly', 'monthly_summary_' . $currentMonth->format('Y_m'))) {
            return;
        }

        // Get stats for this month
        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$currentMonth, $endOfMonth])
            ->get();

        $totalExpenses = $expenses->sum('amount');
        $transactionCount = $expenses->count();

        $totalIncome = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('date', [$currentMonth, $endOfMonth])
            ->sum('amount');

        $totalSavings = $user->savingsGoals()
            ->where('is_archived', false)
            ->sum('current_amount');

        // Get last month's savings for comparison
        $lastMonthSavings = $user->savingsGoals()
            ->where('is_archived', false)
            ->where('created_at', '<', $currentMonth)
            ->sum('current_amount');

        $savingsChange = $lastMonthSavings > 0
            ? (($totalSavings - $lastMonthSavings) / $lastMonthSavings) * 100
            : 0;

        // Build the summary message
        $message = "You spent ₱" . number_format($totalExpenses, 2) . " across {$transactionCount} transactions this month.";

        if ($totalSavings > 0) {
            $message .= " You saved ₱" . number_format($totalSavings, 2);
            if ($savingsChange > 0) {
                $message .= " (up " . round($savingsChange, 1) . "% from last month)";
            }
            $message .= ".";
        }

        if ($totalIncome > 0) {
            $netSavings = $totalIncome - $totalExpenses;
            if ($netSavings > 0) {
                $message .= " You have a net savings of ₱" . number_format($netSavings, 2) . ".";
            }
        }

        $this->createNotification(
            $user->id,
            'monthly',
            'Monthly Summary - ' . $currentMonth->format('F Y'),
            $message,
            [
                'month' => $currentMonth->format('F Y'),
                'total_expenses' => $totalExpenses,
                'transaction_count' => $transactionCount,
                'total_savings' => $totalSavings,
                'total_income' => $totalIncome,
            ]
        );
    }

    /**
     * Create a notification.
     *
     * @param int $userId
     * @param string $category
     * @param string $title
     * @param string $message
     * @param array|null $data
     * @return Notification
     */
    private function createNotification(int $userId, string $category, string $title, string $message, ?array $data = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'category' => $category,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'is_read' => false,
        ]);
    }

    /**
     * Check if a notification already exists.
     *
     * @param int $userId
     * @param string $category
     * @param string $identifier
     * @return bool
     */
    private function notificationExists(int $userId, string $category, string $identifier): bool
    {
        return Notification::where('user_id', $userId)
            ->where('category', $category)
            ->where('data->id', $identifier)
            ->orWhere('data->goal_id', $identifier)
            ->exists();
    }
}