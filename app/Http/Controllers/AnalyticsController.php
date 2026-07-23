<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Pocket;
use App\Models\SavingsGoal;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * AnalyticsController handles all analytics-related functionality
 * including data retrieval, exports, and insights generation.
 */
class AnalyticsController extends Controller
{
    /**
     * Display the Analytics page.
     *
     * @param Request $request
     * @return InertiaResponse
     */
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Analytics/Index');
    }

    /**
     * Get analytics data for the frontend.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getData(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $period = $request->input('period', 'this_month');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $dates = $this->getDateRange($period, $startDate, $endDate);

            $overview = $this->getFinancialOverview($user, $dates);
            $spendingTrend = $this->getSpendingTrend($user, $dates);
            $monthlyComparison = $this->getMonthlyComparison($user, $dates);
            $pocketBreakdown = $this->getPocketBreakdown($user, $dates);
            $savingsPerformance = $this->getSavingsPerformance($user);
            $insights = $this->getFinancialInsights($user, $dates);
            $quickStats = $this->getQuickStatistics($user, $dates);

            return response()->json([
                'overview' => $overview,
                'spending_trend' => $spendingTrend,
                'monthly_comparison' => $monthlyComparison,
                'pocket_breakdown' => $pocketBreakdown,
                'savings_performance' => $savingsPerformance,
                'insights' => $insights,
                'quick_stats' => $quickStats,
                'period' => $period,
            ]);
        } catch (\Exception $exception) {
            Log::error('Analytics error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
                'line' => $exception->getLine(),
            ], 500);
        }
    }

    /**
     * Export analytics data in the specified format.
     *
     * @param Request $request
     * @param string $format
     * @return mixed
     */
    public function export(Request $request, string $format)
    {
        try {
            $user = $request->user();
            $period = $request->input('period', 'this_month');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $dates = $this->getDateRange($period, $startDate, $endDate);
            $data = $this->getExportData($user, $dates);

            switch ($format) {
                case 'pdf':
                    return $this->exportPdf($data);
                case 'excel':
                    return $this->exportExcel($data);
                case 'csv':
                    return $this->exportCsv($data);
                default:
                    return response()->json(['error' => 'Invalid export format'], 400);
            }
        } catch (\Exception $exception) {
            Log::error('Export error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
                'line' => $exception->getLine(),
            ], 500);
        }
    }

    /**
     * Get data for export.
     *
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    private function getExportData($user, array $dates): array
    {
        $start = $dates['start'];
        $end = $dates['end'];

        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->with('pocket')
            ->orderBy('expense_date', 'desc')
            ->get();

        $savings = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->get();

        $pockets = Pocket::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderBy('name')
            ->get();

        $totalIncome = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('date', [$start, $end])
            ->sum('amount');

        $totalExpenses = $expenses->sum('amount');
        $totalSavings = $savings->sum('current_amount');
        $safeBalance = $user->safe_balance ?? 0;
        $netBalance = $totalIncome - $totalExpenses;

        return [
            'user' => $user,
            'expenses' => $expenses,
            'savings' => $savings,
            'pockets' => $pockets,
            'summary' => [
                'total_income' => $totalIncome,
                'total_expenses' => $totalExpenses,
                'total_savings' => $totalSavings,
                'safe_balance' => $safeBalance,
                'net_balance' => $netBalance,
            ],
            'period' => [
                'start' => Carbon::parse($start)->format('M d, Y'),
                'end' => Carbon::parse($end)->format('M d, Y'),
            ],
            'generated_at' => now()->format('F j, Y g:i A'),
        ];
    }

    /**
     * Format currency for export (PHP)
     *
     * @param float $amount
     * @return string
     */
    private function formatCurrency(float $amount): string
    {
        return '₱' . number_format($amount, 2);
    }

    /**
     * Export as PDF.
     *
     * @param array $data
     * @return mixed
     */
    private function exportPdf(array $data)
    {
        if (!class_exists('\Barryvdh\DomPDF\Facade\Pdf')) {
            return response()->json([
                'error' => 'PDF export is not available. Please run: composer require barryvdh/laravel-dompdf'
            ], 500);
        }

        try {
            $pockets = Pocket::where('user_id', $data['user']->id)
                ->where('is_archived', false)
                ->orderBy('name')
                ->get();

            $startDate = $data['period']['start'] ?? now()->startOfMonth()->format('M d, Y');
            $endDate = $data['period']['end'] ?? now()->endOfMonth()->format('M d, Y');
            
            $start = Carbon::parse($startDate)->toDateString();
            $end = Carbon::parse($endDate)->toDateString();

            foreach ($pockets as $pocket) {
                $spent = Expense::where('user_id', $data['user']->id)
                    ->where('pocket_id', $pocket->id)
                    ->where('is_archived', false)
                    ->whereBetween('expense_date', [$start, $end])
                    ->sum('amount');
                
                $pocket->period_spent = $spent;
                $pocket->period_utilization = $pocket->allocated > 0 
                    ? round(($spent / $pocket->allocated) * 100, 1) 
                    : 0;
            }

            $monthlyTrend = [];
            $expenses = $data['expenses'] ?? collect();
            if ($expenses->count() > 0) {
                $trendData = $expenses->groupBy(function ($expense) {
                    return Carbon::parse($expense->expense_date)->format('M');
                })->map(function ($group) {
                    return $group->sum('amount');
                });
                
                foreach ($trendData as $month => $amount) {
                    $monthlyTrend[] = [
                        'month' => $month,
                        'amount' => $amount,
                    ];
                }
            }

            $pdfData = [
                'user' => $data['user'],
                'currency' => '₱',
                'generated_at' => $data['generated_at'],
                'period' => $data['period'],
                'summary' => $data['summary'],
                'expenses' => $expenses,
                'savings' => $data['savings'],
                'pockets' => $pockets,
                'monthly_trend' => $monthlyTrend,
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.analytics', $pdfData);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('analytics_report_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $exception) {
            Log::error('PDF generation error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to generate PDF: ' . $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Export as Excel using Spatie Simple Excel.
     *
     * @param array $data
     * @return mixed
     */
    private function exportExcel(array $data)
    {
        if (!class_exists('\Spatie\SimpleExcel\SimpleExcelWriter')) {
            return response()->json([
                'error' => 'Excel export is not available. Please run: composer require spatie/simple-excel'
            ], 500);
        }

        try {
            $fileName = 'analytics_report_' . date('Y-m-d') . '.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), 'export_') . '.xlsx';

            $writer = \Spatie\SimpleExcel\SimpleExcelWriter::create($tempFile);

            // ===== HEADER SECTION =====
            $writer->addRow(['LEDGERLEAF FINANCIAL REPORT']);
            $writer->addRow([]);
            $writer->addRow(['Generated:', $data['generated_at']]);
            $writer->addRow(['Period:', $data['period']['start'] . ' - ' . $data['period']['end']]);
            $writer->addRow(['User:', $data['user']->name . ' (' . $data['user']->email . ')']);
            $writer->addRow([]);

            // ===== FINANCIAL SUMMARY =====
            $writer->addRow(['FINANCIAL SUMMARY']);
            $writer->addRow(['Metric', 'Amount']);
            $writer->addRow(['Total Income', $this->formatCurrency($data['summary']['total_income'])]);
            $writer->addRow(['Total Expenses', $this->formatCurrency($data['summary']['total_expenses'])]);
            $writer->addRow(['Net Balance', $this->formatCurrency($data['summary']['net_balance'])]);
            $writer->addRow(['Total Savings', $this->formatCurrency($data['summary']['total_savings'])]);
            $writer->addRow(['Safe Balance', $this->formatCurrency($data['summary']['safe_balance'])]);
            $writer->addRow([]);

            // ===== POCKETS OVERVIEW =====
            if ($data['pockets']->isNotEmpty()) {
                $writer->addRow(['POCKETS OVERVIEW']);
                $writer->addRow(['Pocket Name', 'Allocated', 'Spent', 'Remaining', 'Utilization']);
                
                foreach ($data['pockets'] as $pocket) {
                    $start = Carbon::parse($data['period']['start'])->toDateString();
                    $end = Carbon::parse($data['period']['end'])->toDateString();
                    
                    $spent = Expense::where('user_id', $data['user']->id)
                        ->where('pocket_id', $pocket->id)
                        ->where('is_archived', false)
                        ->whereBetween('expense_date', [$start, $end])
                        ->sum('amount');
                    
                    $allocated = $pocket->allocated ?? 0;
                    $remaining = $allocated - $spent;
                    $utilization = $allocated > 0 ? round(($spent / $allocated) * 100, 1) : 0;
                    
                    $writer->addRow([
                        $pocket->name,
                        $this->formatCurrency($allocated),
                        $this->formatCurrency($spent),
                        $this->formatCurrency($remaining),
                        $utilization . '%',
                    ]);
                }
                $writer->addRow([]);
            }

            // ===== EXPENSES =====
            $writer->addRow(['EXPENSE DETAILS']);
            $writer->addRow(['Date', 'Description', 'Pocket', 'Payment Method', 'Amount']);

            if ($data['expenses']->isNotEmpty()) {
                foreach ($data['expenses'] as $expense) {
                    $writer->addRow([
                        Carbon::parse($expense->expense_date)->format('M d, Y'),
                        $expense->description,
                        $expense->pocket?->name ?? 'Uncategorized',
                        $expense->payment_method ?? 'N/A',
                        $this->formatCurrency($expense->amount),
                    ]);
                }

                $writer->addRow([
                    'TOTAL',
                    '',
                    '',
                    '',
                    $this->formatCurrency($data['summary']['total_expenses']),
                ]);
            } else {
                $writer->addRow(['No expenses recorded in this period.']);
            }
            $writer->addRow([]);

            // ===== SAVINGS GOALS =====
            $writer->addRow(['SAVINGS GOALS']);
            $writer->addRow(['Goal Name', 'Target', 'Current', 'Progress', 'Status']);

            if ($data['savings']->isNotEmpty()) {
                foreach ($data['savings'] as $goal) {
                    $progress = $goal->target_amount > 0
                        ? round(($goal->current_amount / $goal->target_amount) * 100, 1)
                        : 0;

                    $writer->addRow([
                        $goal->name,
                        $this->formatCurrency($goal->target_amount),
                        $this->formatCurrency($goal->current_amount),
                        $progress . '%',
                        $goal->is_completed ? 'Completed' : 'In Progress',
                    ]);
                }
            } else {
                $writer->addRow(['No savings goals created yet.']);
            }
            $writer->addRow([]);

            // ===== FOOTER =====
            $writer->addRow(['']);
            $writer->addRow(['Generated by LedgerLeaf Financial Management System']);
            $writer->addRow(['Confidential - For authorized use only']);

            $writer->close();

            return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
        } catch (\Exception $exception) {
            Log::error('Excel generation error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to generate Excel: ' . $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Export as CSV.
     *
     * @param array $data
     * @return mixed
     */
    private function exportCsv(array $data)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="analytics_report_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            // ===== HEADER =====
            fputcsv($file, ['LEDGERLEAF FINANCIAL REPORT']);
            fputcsv($file, ['Generated:', $data['generated_at']]);
            fputcsv($file, ['Period:', $data['period']['start'] . ' - ' . $data['period']['end']]);
            fputcsv($file, ['User:', $data['user']->name . ' (' . $data['user']->email . ')']);
            fputcsv($file, []);

            // ===== FINANCIAL SUMMARY =====
            fputcsv($file, ['FINANCIAL SUMMARY']);
            fputcsv($file, ['Metric', 'Amount']);
            fputcsv($file, ['Total Income', $this->formatCurrency($data['summary']['total_income'])]);
            fputcsv($file, ['Total Expenses', $this->formatCurrency($data['summary']['total_expenses'])]);
            fputcsv($file, ['Net Balance', $this->formatCurrency($data['summary']['net_balance'])]);
            fputcsv($file, ['Total Savings', $this->formatCurrency($data['summary']['total_savings'])]);
            fputcsv($file, ['Safe Balance', $this->formatCurrency($data['summary']['safe_balance'])]);
            fputcsv($file, []);

            // ===== POCKETS OVERVIEW =====
            if ($data['pockets']->isNotEmpty()) {
                fputcsv($file, ['POCKETS OVERVIEW']);
                fputcsv($file, ['Pocket Name', 'Allocated', 'Spent', 'Remaining', 'Utilization']);
                
                foreach ($data['pockets'] as $pocket) {
                    $start = Carbon::parse($data['period']['start'])->toDateString();
                    $end = Carbon::parse($data['period']['end'])->toDateString();
                    
                    $spent = Expense::where('user_id', $data['user']->id)
                        ->where('pocket_id', $pocket->id)
                        ->where('is_archived', false)
                        ->whereBetween('expense_date', [$start, $end])
                        ->sum('amount');
                    
                    $allocated = $pocket->allocated ?? 0;
                    $remaining = $allocated - $spent;
                    $utilization = $allocated > 0 ? round(($spent / $allocated) * 100, 1) : 0;
                    
                    fputcsv($file, [
                        $pocket->name,
                        $this->formatCurrency($allocated),
                        $this->formatCurrency($spent),
                        $this->formatCurrency($remaining),
                        $utilization . '%',
                    ]);
                }
                fputcsv($file, []);
            }

            // ===== EXPENSES =====
            fputcsv($file, ['EXPENSE DETAILS']);
            fputcsv($file, ['Date', 'Description', 'Pocket', 'Payment Method', 'Amount']);

            foreach ($data['expenses'] as $expense) {
                fputcsv($file, [
                    Carbon::parse($expense->expense_date)->format('M d, Y'),
                    $expense->description,
                    $expense->pocket?->name ?? 'Uncategorized',
                    $expense->payment_method ?? 'N/A',
                    $this->formatCurrency($expense->amount),
                ]);
            }

            if ($data['expenses']->isNotEmpty()) {
                fputcsv($file, [
                    'TOTAL',
                    '',
                    '',
                    '',
                    $this->formatCurrency($data['summary']['total_expenses']),
                ]);
            }
            fputcsv($file, []);

            // ===== SAVINGS GOALS =====
            fputcsv($file, ['SAVINGS GOALS']);
            fputcsv($file, ['Goal Name', 'Target', 'Current', 'Progress', 'Status']);

            foreach ($data['savings'] as $goal) {
                $progress = $goal->target_amount > 0
                    ? round(($goal->current_amount / $goal->target_amount) * 100, 1)
                    : 0;

                fputcsv($file, [
                    $goal->name,
                    $this->formatCurrency($goal->target_amount),
                    $this->formatCurrency($goal->current_amount),
                    $progress . '%',
                    $goal->is_completed ? 'Completed' : 'In Progress',
                ]);
            }
            fputcsv($file, []);

            // ===== FOOTER =====
            fputcsv($file, ['']);
            fputcsv($file, ['Generated by LedgerLeaf Financial Management System']);
            fputcsv($file, ['Confidential - For authorized use only']);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get date range based on period.
     * 
     * @param string $period
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getDateRange(string $period, ?string $startDate, ?string $endDate): array
    {
        $now = now();

        switch ($period) {
            case 'this_week':
                return [
                    'start' => $now->copy()->startOfWeek()->toDateString(),
                    'end' => $now->copy()->endOfWeek()->toDateString(),
                ];
            case 'this_month':
                return [
                    'start' => $now->copy()->startOfMonth()->toDateString(),
                    'end' => $now->copy()->endOfMonth()->toDateString(),
                ];
            case 'last_3_months':
                return [
                    'start' => $now->copy()->subMonths(3)->startOfDay()->toDateString(),
                    'end' => now()->toDateString(),
                ];
            case 'this_year':
                return [
                    'start' => $now->copy()->startOfYear()->toDateString(),
                    'end' => $now->copy()->endOfYear()->toDateString(),
                ];
            case 'custom':
                return [
                    'start' => $startDate ?? now()->startOfMonth()->toDateString(),
                    'end' => $endDate ?? now()->toDateString(),
                ];
            default:
                return [
                    'start' => $now->copy()->startOfMonth()->toDateString(),
                    'end' => $now->copy()->endOfMonth()->toDateString(),
                ];
        }
    }

    /**
     * Get financial overview (income, expenses, savings, remaining).
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getFinancialOverview($user, array $dates): array
    {
        $start = $dates['start'];
        $end = $dates['end'];

        $income = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('date', [$start, $end])
            ->sum('amount');

        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->sum('amount');

        $prevStart = Carbon::parse($start)->subDays(
            Carbon::parse($end)->diffInDays(Carbon::parse($start))
        )->toDateString();

        $prevEnd = Carbon::parse($start)->subDay()->toDateString();

        $prevExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$prevStart, $prevEnd])
            ->sum('amount');

        $savings = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->sum('current_amount');

        $remaining = $user->safe_balance ?? 0;

        $expenseChange = $prevExpenses > 0
            ? (($expenses - $prevExpenses) / $prevExpenses) * 100
            : 0;

        return [
            'income' => $income,
            'expenses' => $expenses,
            'savings' => $savings,
            'remaining' => $remaining,
            'expense_change' => round($expenseChange, 1),
            'expense_change_direction' => $expenseChange >= 0 ? 'up' : 'down',
        ];
    }

    /**
     * Get daily spending trend.
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getSpendingTrend($user, array $dates): array
    {
        $start = Carbon::parse($dates['start']);
        $end = Carbon::parse($dates['end']);
        $trend = [];
        $current = clone $start;

        while ($current <= $end) {
            $dayExpenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereDate('expense_date', $current->toDateString())
                ->sum('amount');

            $dayIncome = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereDate('date', $current->toDateString())
                ->sum('amount');

            $trend[] = [
                'date' => $current->toDateString(),
                'label' => $current->format('M d'),
                'expenses' => $dayExpenses,
                'income' => $dayIncome,
                'balance' => $dayIncome - $dayExpenses,
            ];

            $current->addDay();
        }

        return $trend;
    }

    /**
     * Get monthly comparison data.
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getMonthlyComparison($user, array $dates): array
    {
        $start = Carbon::parse($dates['start']);
        $end = Carbon::parse($dates['end']);
        $months = [];
        $current = clone $start;
        $current->startOfMonth();

        while ($current <= $end) {
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd = $current->copy()->endOfMonth();

            $income = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->sum('amount');

            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $savings = SavingsGoal::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('current_amount');

            $months[] = [
                'month' => $current->format('M Y'),
                'income' => $income,
                'expenses' => $expenses,
                'savings' => $savings,
            ];

            $current->addMonth();
        }

        return $months;
    }

    /**
     * Get spending breakdown by pocket.
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getPocketBreakdown($user, array $dates): array
    {
        $start = $dates['start'];
        $end = $dates['end'];

        $pockets = Pocket::where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->get();

        $breakdown = [];
        $total = 0;

        foreach ($pockets as $pocket) {
            $spent = Expense::where('user_id', $user->id)
                ->where('pocket_id', $pocket->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$start, $end])
                ->sum('amount');

            if ($spent > 0) {
                $breakdown[] = [
                    'id' => $pocket->id,
                    'name' => $pocket->name,
                    'icon' => $pocket->icon,
                    'color' => $pocket->color,
                    'amount' => $spent,
                    'percentage' => 0,
                ];

                $total += $spent;
            }
        }

        foreach ($breakdown as &$item) {
            $item['percentage'] = $total > 0 ? round(($item['amount'] / $total) * 100, 1) : 0;
        }

        return [
            'data' => $breakdown,
            'total' => $total,
        ];
    }

    /**
     * Get savings performance data.
     * 
     * @param mixed $user
     * @return array
     */
    public function getSavingsPerformance($user): array
    {
        $goals = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->get();

        $totalSaved = $goals->sum('current_amount');
        $totalTarget = $goals->sum('target_amount');
        $completedGoals = $goals->where('is_completed', true)->count();
        $activeGoals = $goals->where('is_completed', false)->count();

        $sixMonthsAgo = now()->subMonths(6);
        $savingsRate = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->avg('current_amount') ?? 0;

        return [
            'total_saved' => $totalSaved,
            'total_target' => $totalTarget,
            'completed_goals' => $completedGoals,
            'active_goals' => $activeGoals,
            'savings_rate' => round($savingsRate, 2),
            'progress_percentage' => $totalTarget > 0 ? round(($totalSaved / $totalTarget) * 100, 1) : 0,
        ];
    }

    /**
     * Generate financial insights.
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getFinancialInsights($user, array $dates): array
    {
        $insights = [];
        $start = $dates['start'];
        $end = $dates['end'];

        $totalExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->sum('amount');

        if ($totalExpenses > 0) {
            $insights[] = [
                'id' => 'total_spent',
                'type' => 'neutral',
                'title' => 'Total Spending',
                'description' => 'You spent ' . $this->formatCurrency($totalExpenses) . ' in this period.',
            ];
        }

        $topPocket = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->selectRaw('pocket_id, SUM(amount) as total')
            ->groupBy('pocket_id')
            ->orderBy('total', 'desc')
            ->first();

        if ($topPocket && $totalExpenses > 0) {
            $pocket = Pocket::find($topPocket->pocket_id);
            $pocketName = $pocket ? $pocket->name : 'Uncategorized';
            $percentage = round(($topPocket->total / $totalExpenses) * 100, 1);

            $insights[] = [
                'id' => 'top_pocket',
                'type' => 'warning',
                'title' => 'Top Spending Category',
                'description' => "{$pocketName} accounts for {$percentage}% of your spending.",
            ];
        }

        $savings = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->sum('current_amount');

        if ($savings > 0) {
            $insights[] = [
                'id' => 'total_savings',
                'type' => 'positive',
                'title' => 'Savings Progress',
                'description' => 'You have saved ' . $this->formatCurrency($savings) . ' across your goals.',
            ];
        }

        $previousPeriod = Carbon::parse($start)->subDays(
            Carbon::parse($end)->diffInDays(Carbon::parse($start))
        );

        $prevStart = $previousPeriod->toDateString();
        $prevEnd = Carbon::parse($start)->subDay()->toDateString();

        $prevExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$prevStart, $prevEnd])
            ->sum('amount');

        if ($prevExpenses > 0) {
            $change = (($totalExpenses - $prevExpenses) / $prevExpenses) * 100;

            if (abs($change) > 5) {
                $insights[] = [
                    'id' => 'spending_change',
                    'type' => $change < 0 ? 'positive' : 'warning',
                    'title' => $change < 0 ? 'Spending Decreased' : 'Spending Increased',
                    'description' => 'Your spending is ' . abs(round($change, 1)) . '% ' .
                        ($change < 0 ? 'lower' : 'higher') . ' than the previous period.',
                ];
            }
        }

        if (empty($insights)) {
            $insights[] = [
                'id' => 'no_data',
                'type' => 'neutral',
                'title' => 'Not Enough Data',
                'description' => 'Continue using LedgerLeaf to generate personalized insights.',
            ];
        }

        return $insights;
    }

    /**
     * Get quick statistics.
     * 
     * @param mixed $user
     * @param array $dates
     * @return array
     */
    public function getQuickStatistics($user, array $dates): array
    {
        $start = $dates['start'];
        $end = $dates['end'];

        $totalTransactions = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->count();

        $averageExpense = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->avg('amount') ?? 0;

        $largestExpense = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->max('amount') ?? 0;

        $smallestExpense = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$start, $end])
            ->min('amount') ?? 0;

        $activePockets = Pocket::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereNull('deleted_at')
            ->count();

        $completedGoals = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->where('is_completed', true)
            ->count();

        return [
            'total_transactions' => $totalTransactions,
            'average_expense' => $averageExpense,
            'largest_expense' => $largestExpense,
            'smallest_expense' => $smallestExpense,
            'active_pockets' => $activePockets,
            'completed_goals' => $completedGoals,
        ];
    }
}