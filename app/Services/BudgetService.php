<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;

class BudgetService
{
    /**
     * Get or create budget for a category.
     */
    public function getOrCreateBudget(User $user, int $categoryId, ?float $amount = null): Budget
    {
        $monthYear = now()->format('Y-m-01');

        $budget = Budget::firstOrCreate(
            [
                'user_id' => $user->id,
                'category_id' => $categoryId,
                'month_year' => $monthYear,
            ],
            [
                'allocated_amount' => $amount ?? 0,
                'spent_amount' => 0,
            ]
        );

        return $budget;
    }

    /**
     * Update budget allocation.
     */
    public function updateBudget(Budget $budget, float $amount): Budget
    {
        $budget->update([
            'allocated_amount' => $amount,
        ]);

        return $budget;
    }

    /**
     * Get budget utilization for a user.
     */
    public function getBudgetUtilization(User $user, int $month = null, int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        $budgets = Budget::with('category')
            ->where('user_id', $user->id)
            ->whereMonth('month_year', $month)
            ->whereYear('month_year', $year)
            ->get();

        $utilization = [];

        foreach ($budgets as $budget) {
            $spent = $budget->category?->getSpentForMonth($month, $year) ?? 0;
            $allocated = $budget->allocated_amount;
            $remaining = $allocated - $spent;
            $percentage = $allocated > 0 ? ($spent / $allocated) * 100 : 0;

            $utilization[] = [
                'category_id' => $budget->category_id,
                'category_name' => $budget->category?->name ?? 'Uncategorized',
                'allocated' => $allocated,
                'spent' => $spent,
                'remaining' => $remaining,
                'percentage' => min($percentage, 100),
                'is_over_budget' => $remaining < 0,
            ];
        }

        return $utilization;
    }

    /**
     * Get budget summary.
     */
    public function getBudgetSummary(User $user, int $month = null, int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        $budgets = Budget::where('user_id', $user->id)
            ->whereMonth('month_year', $month)
            ->whereYear('month_year', $year)
            ->get();

        $totalAllocated = $budgets->sum('allocated_amount');
        $totalSpent = $budgets->sum('spent_amount');
        $totalRemaining = $totalAllocated - $totalSpent;

        return [
            'total_allocated' => $totalAllocated,
            'total_spent' => $totalSpent,
            'total_remaining' => $totalRemaining,
            'budget_count' => $budgets->count(),
            'over_budget_count' => $budgets->filter(function ($budget) {
                return $budget->spent_amount > $budget->allocated_amount;
            })->count(),
        ];
    }

    /**
     * Get monthly budget trends.
     */
    public function getBudgetTrends(User $user, int $months = 6): array
    {
        $trends = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $summary = $this->getBudgetSummary($user, $date->month, $date->year);

            $trends[] = [
                'month' => $date->format('M Y'),
                'allocated' => $summary['total_allocated'],
                'spent' => $summary['total_spent'],
                'remaining' => $summary['total_remaining'],
            ];
        }

        return $trends;
    }

    /**
     * Copy budget from previous month.
     */
    public function copyPreviousMonthBudget(User $user): void
    {
        $previousMonth = now()->subMonth();
        $currentMonth = now();

        $previousBudgets = Budget::where('user_id', $user->id)
            ->whereMonth('month_year', $previousMonth->month)
            ->whereYear('month_year', $previousMonth->year)
            ->get();

        foreach ($previousBudgets as $previousBudget) {
            Budget::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'category_id' => $previousBudget->category_id,
                    'month_year' => $currentMonth->format('Y-m-01'),
                ],
                [
                    'allocated_amount' => $previousBudget->allocated_amount,
                    'spent_amount' => 0,
                ]
            );
        }
    }
}