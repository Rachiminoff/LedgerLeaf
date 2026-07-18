<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class ReportService
{
    /**
     * Get monthly report.
     */
    public function getMonthlyReport(User $user, int $month = null, int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        $expenses = $user->expenses()
            ->with(['category', 'pocket'])
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->where('is_archived', false)
            ->get();

        $totalExpenses = $expenses->sum('amount');
        $totalIncome = $user->transactions()
            ->where('type', 'income')
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->sum('amount');

        // Category breakdown
        $categoryBreakdown = $expenses->groupBy('category_id')->map(function ($items) {
            $category = $items->first()->category;
            return [
                'category_id' => $category?->id,
                'category_name' => $category?->name ?? 'Uncategorized',
                'category_icon' => $category?->icon ?? '📄',
                'category_color' => $category?->color ?? '#9A9A9A',
                'total' => $items->sum('amount'),
                'count' => $items->count(),
                'percentage' => 0, // Calculated later
            ];
        })->values();

        // Calculate percentages
        $categoryBreakdown = $categoryBreakdown->map(function ($item) use ($totalExpenses) {
            $item['percentage'] = $totalExpenses > 0 ? round(($item['total'] / $totalExpenses) * 100, 1) : 0;
            return $item;
        });

        // Daily spending
        $dailySpending = $expenses->groupBy('expense_date')->map(function ($items) {
            return $items->sum('amount');
        })->toArray();

        // Pocket breakdown
        $pocketBreakdown = $expenses->groupBy('pocket_id')->map(function ($items) {
            $pocket = $items->first()->pocket;
            return [
                'pocket_id' => $pocket?->id,
                'pocket_name' => $pocket?->name ?? 'Uncategorized',
                'total' => $items->sum('amount'),
                'count' => $items->count(),
            ];
        })->values();

        // Largest expenses
        $largestExpenses = $expenses->sortByDesc('amount')->take(5);

        return [
            'month' => Carbon::create($year, $month)->format('F Y'),
            'total_income' => $totalIncome,
            'total_expenses' => $totalExpenses,
            'net_savings' => $totalIncome - $totalExpenses,
            'transaction_count' => $expenses->count(),
            'average_daily' => $expenses->count() > 0 ? $totalExpenses / $expenses->count() : 0,
            'category_breakdown' => $categoryBreakdown,
            'daily_spending' => $dailySpending,
            'pocket_breakdown' => $pocketBreakdown,
            'largest_expenses' => $largestExpenses,
        ];
    }

    /**
     * Get yearly report.
     */
    public function getYearlyReport(User $user, int $year = null): array
    {
        $year = $year ?? now()->year;

        $monthlyData = [];

        for ($month = 1; $month <= 12; $month++) {
            $report = $this->getMonthlyReport($user, $month, $year);
            $monthlyData[] = [
                'month' => Carbon::create($year, $month)->format('M'),
                'income' => $report['total_income'],
                'expenses' => $report['total_expenses'],
                'net' => $report['net_savings'],
            ];
        }

        return [
            'year' => $year,
            'monthly_data' => $monthlyData,
            'total_income' => collect($monthlyData)->sum('income'),
            'total_expenses' => collect($monthlyData)->sum('expenses'),
            'total_net' => collect($monthlyData)->sum('net'),
        ];
    }

    /**
     * Get category spending report.
     */
    public function getCategorySpendingReport(User $user, int $month = null, int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        return $user->categories()
            ->with(['expenses' => function ($query) use ($month, $year) {
                $query->whereMonth('expense_date', $month)
                    ->whereYear('expense_date', $year)
                    ->where('is_archived', false);
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'category_id' => $category->id,
                    'category_name' => $category->name,
                    'category_icon' => $category->icon,
                    'category_color' => $category->color,
                    'total' => $category->expenses->sum('amount'),
                    'count' => $category->expenses->count(),
                    'average' => $category->expenses->avg('amount') ?? 0,
                ];
            })
            ->filter(function ($category) {
                return $category['total'] > 0;
            })
            ->sortByDesc('total')
            ->values()
            ->toArray();
    }

    /**
     * Get spending insights.
     */
    public function getSpendingInsights(User $user): array
    {
        $insights = [];
        $currentMonth = $this->getMonthlyReport($user);
        $lastMonth = $this->getMonthlyReport(
            $user,
            now()->subMonth()->month,
            now()->subMonth()->year
        );

        // Month-over-month comparison
        if ($lastMonth['total_expenses'] > 0) {
            $change = (($currentMonth['total_expenses'] - $lastMonth['total_expenses']) / $lastMonth['total_expenses']) * 100;

            if ($change < -10) {
                $insights[] = [
                    'type' => 'positive',
                    'title' => 'Great Job! 🎉',
                    'description' => "You spent " . abs(round($change, 1)) . "% less this month compared to last month.",
                ];
            } elseif ($change > 10) {
                $insights[] = [
                    'type' => 'warning',
                    'title' => 'Spending Alert ⚠️',
                    'description' => "Your spending increased by " . round($change, 1) . "% this month. Consider reviewing your budget.",
                ];
            } else {
                $insights[] = [
                    'type' => 'neutral',
                    'title' => 'Consistent Spending 📊',
                    'description' => "Your spending is stable compared to last month.",
                ];
            }
        }

        // Top category
        if (!empty($currentMonth['category_breakdown'])) {
            $topCategory = collect($currentMonth['category_breakdown'])->sortByDesc('total')->first();
            if ($topCategory && $currentMonth['total_expenses'] > 0) {
                $percentage = round(($topCategory['total'] / $currentMonth['total_expenses']) * 100, 1);
                $insights[] = [
                    'type' => 'neutral',
                    'title' => 'Top Category 🏷️',
                    'description' => "Your largest expense category is {$topCategory['category_name']} at {$percentage}% of total spending.",
                ];
            }
        }

        // Daily average
        $averageDaily = $currentMonth['average_daily'] ?? 0;
        if ($averageDaily > 0) {
            $insights[] = [
                'type' => 'neutral',
                'title' => 'Daily Average 📅',
                'description' => "You're spending an average of ₱" . number_format($averageDaily, 2) . " per day this month.",
            ];
        }

        return $insights;
    }
}