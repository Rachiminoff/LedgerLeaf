<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Pocket;
use App\Models\SavingsGoal;
use App\Models\Transaction;
use App\Models\Budget;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ReportController extends Controller
{
    protected AnalyticsController $analyticsController;

    public function __construct(AnalyticsController $analyticsController)
    {
        $this->analyticsController = $analyticsController;
    }

    /**
     * Display the reports page.
     *
     * @param Request $request
     * @return InertiaResponse
     */
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Analytics/Index');
    }

    /**
     * Get monthly report data using AnalyticsController.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function monthly(Request $request)
    {
        try {
            $user = $request->user();
            $year = $request->input('year', now()->year);
            $month = $request->input('month', now()->month);

            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $dates = ['start' => $startDate->toDateString(), 'end' => $endDate->toDateString()];
            
            $overview = $this->analyticsController->getFinancialOverview($user, $dates);
            $pocketBreakdown = $this->analyticsController->getPocketBreakdown($user, $dates);
            
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->get();

            return response()->json([
                'period' => [
                    'start' => $startDate->format('M d, Y'),
                    'end' => $endDate->format('M d, Y'),
                ],
                'total_income' => $overview['income'],
                'total_expenses' => $overview['expenses'],
                'net_balance' => $overview['income'] - $overview['expenses'],
                'pocket_breakdown' => $pocketBreakdown['data'],
                'expenses' => $expenses,
            ]);
        } catch (\Exception $exception) {
            Log::error('Monthly report error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Get yearly report data using AnalyticsController.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function yearly(Request $request)
    {
        try {
            $user = $request->user();
            $year = $request->input('year', now()->year);

            $startDate = Carbon::create($year, 1, 1)->startOfYear();
            $endDate = Carbon::create($year, 12, 31)->endOfYear();

            $dates = ['start' => $startDate->toDateString(), 'end' => $endDate->toDateString()];
            $monthlyData = $this->analyticsController->getMonthlyComparison($user, $dates);

            return response()->json([
                'year' => $year,
                'monthly_data' => $monthlyData,
                'total_income' => array_sum(array_column($monthlyData, 'income')),
                'total_expenses' => array_sum(array_column($monthlyData, 'expenses')),
            ]);
        } catch (\Exception $exception) {
            Log::error('Yearly report error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Get category report data using AnalyticsController.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function category(Request $request)
    {
        try {
            $user = $request->user();
            $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

            $dates = ['start' => $startDate, 'end' => $endDate];
            
            $pocketBreakdown = $this->analyticsController->getPocketBreakdown($user, $dates);
            
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->get();

            $categoryData = [];
            foreach ($pocketBreakdown['data'] as $item) {
                $pocketExpenses = $expenses->where('pocket_id', $item['id']);
                $categoryData[] = [
                    'pocket_id' => $item['id'],
                    'pocket_name' => $item['name'],
                    'color' => $item['color'] ?? '#6B7280',
                    'icon' => $item['icon'] ?? 'mdi:folder',
                    'total' => $item['amount'],
                    'count' => $pocketExpenses->count(),
                    'percentage' => $item['percentage'],
                ];
            }

            usort($categoryData, function ($a, $b) {
                return $b['total'] <=> $a['total'];
            });

            return response()->json([
                'period' => [
                    'start' => Carbon::parse($startDate)->format('M d, Y'),
                    'end' => Carbon::parse($endDate)->format('M d, Y'),
                ],
                'categories' => $categoryData,
                'total' => $pocketBreakdown['total'],
            ]);
        } catch (\Exception $exception) {
            Log::error('Category report error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Get full report data using AnalyticsController.
     */
    public function getFullReport(Request $request)
    {
        try {
            $user = $request->user();
            $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

            $dates = ['start' => $startDate, 'end' => $endDate];

            // Get all data from analytics
            $overview = $this->analyticsController->getFinancialOverview($user, $dates);
            $spendingTrend = $this->analyticsController->getSpendingTrend($user, $dates);
            $pocketBreakdown = $this->analyticsController->getPocketBreakdown($user, $dates);
            $savingsPerformance = $this->analyticsController->getSavingsPerformance($user);
            $quickStats = $this->analyticsController->getQuickStatistics($user, $dates);

            // Get ALL pockets with proper data structure
            $pockets = Pocket::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereNull('deleted_at')
                ->get();

            // Format pockets with spending data for the period
            $formattedPockets = $pockets->map(function ($pocket) use ($user, $startDate, $endDate) {
                $spent = Expense::where('user_id', $user->id)
                    ->where('pocket_id', $pocket->id)
                    ->where('is_archived', false)
                    ->whereBetween('expense_date', [$startDate, $endDate])
                    ->sum('amount');
                
                return [
                    'id' => $pocket->id,
                    'name' => $pocket->name,
                    'icon' => $pocket->icon ?? 'mdi:folder',
                    'color' => $pocket->color ?? '#5CB85C',
                    'allocated' => $pocket->allocated ?? 0,
                    'spent' => $spent, // Spent in this period
                    'total_spent' => $pocket->spent ?? 0, // Total spent all time
                    'balance' => $pocket->balance ?? 0,
                    'remaining' => ($pocket->allocated ?? 0) - $spent,
                    'description' => $pocket->description,
                    'progress' => $pocket->allocated > 0 ? round(($spent / $pocket->allocated) * 100, 2) : 0,
                ];
            });

            // Get raw data for detailed listing
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->orderBy('expense_date', 'desc')
                ->get();

            $savings = SavingsGoal::where('user_id', $user->id)
                ->where('is_archived', false)
                ->get();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->orderBy('date', 'desc')
                ->get();

            // Get budgets
            $budgets = Budget::where('user_id', $user->id)
                ->where('month_year', Carbon::now()->format('Y-m-01'))
                ->with('categories')
                ->first();

            // Calculate additional stats
            $totalPocketAllocated = $pockets->sum('allocated');
            $totalPocketSpent = $formattedPockets->sum('spent');
            $pocketUtilization = $totalPocketAllocated > 0 ? ($totalPocketSpent / $totalPocketAllocated) * 100 : 0;

            // Get monthly trend from spending trend
            $monthlyTrend = [];
            $trendData = collect($spendingTrend);
            $trendData->groupBy(function ($item) {
                return Carbon::parse($item['date'])->format('M');
            })->map(function ($group, $month) use (&$monthlyTrend) {
                $monthlyTrend[] = [
                    'month' => $month,
                    'amount' => $group->sum('expenses'),
                ];
            });

            // Get top pocket from pocket breakdown
            $topPocket = collect($pocketBreakdown['data'])->sortByDesc('amount')->first();

            return response()->json([
                'period' => [
                    'start' => Carbon::parse($startDate)->format('M d, Y'),
                    'end' => Carbon::parse($endDate)->format('M d, Y'),
                ],
                'summary' => [
                    'total_income' => $overview['income'],
                    'total_expenses' => $overview['expenses'],
                    'total_savings' => $savingsPerformance['total_saved'],
                    'safe_balance' => $overview['remaining'],
                    'net_balance' => $overview['income'] - $overview['expenses'],
                    'average_daily_expense' => $quickStats['average_expense'],
                    'largest_expense' => $quickStats['largest_expense'],
                    'smallest_expense' => $quickStats['smallest_expense'],
                    'transaction_count' => $quickStats['total_transactions'],
                    'pocket_utilization' => $pocketUtilization,
                ],
                'expenses' => $expenses,
                'pockets' => $formattedPockets,
                'savings' => $savings,
                'budgets' => $budgets,
                'transactions' => $transactions,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'top_pocket' => $topPocket,
                'monthly_trend' => $monthlyTrend,
                'pocket_chart_data' => $pocketBreakdown['data'],
            ]);
        } catch (\Exception $exception) {
            Log::error('Full report error: ' . $exception->getMessage());
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    /**
     * Export report as CSV.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportCsv(Request $request)
    {
        try {
            $user = $request->user();
            $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

            $dates = ['start' => $startDate, 'end' => $endDate];
            
            $overview = $this->analyticsController->getFinancialOverview($user, $dates);
            $quickStats = $this->analyticsController->getQuickStatistics($user, $dates);
            
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->orderBy('expense_date', 'desc')
                ->get();

            // Get ALL pockets with spending data
            $pockets = Pocket::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereNull('deleted_at')
                ->get();

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="ledgerleaf_report_' . date('Y-m-d') . '.csv"',
            ];

            $callback = function () use ($expenses, $user, $startDate, $endDate, $overview, $quickStats, $pockets) {
                $file = fopen('php://output', 'w');
                
                // Report Header
                fputcsv($file, ['LedgerLeaf Financial Report']);
                fputcsv($file, ['Generated on:', now()->format('F j, Y g:i A')]);
                fputcsv($file, ['Period:', Carbon::parse($startDate)->format('M d, Y') . ' - ' . Carbon::parse($endDate)->format('M d, Y')]);
                fputcsv($file, ['User:', $user->name . ' (' . $user->email . ')']);
                fputcsv($file, []);
                
                // Summary
                fputcsv($file, ['SUMMARY']);
                fputcsv($file, ['Total Income', number_format($overview['income'], 2)]);
                fputcsv($file, ['Total Expenses', number_format($overview['expenses'], 2)]);
                fputcsv($file, ['Net Balance', number_format($overview['income'] - $overview['expenses'], 2)]);
                fputcsv($file, ['Total Records', $quickStats['total_transactions']]);
                fputcsv($file, ['Average Expense', number_format($quickStats['average_expense'], 2)]);
                fputcsv($file, ['Largest Expense', number_format($quickStats['largest_expense'], 2)]);
                fputcsv($file, ['Smallest Expense', number_format($quickStats['smallest_expense'], 2)]);
                fputcsv($file, []);
                
                // Pocket Overview
                if ($pockets->isNotEmpty()) {
                    fputcsv($file, ['POCKET OVERVIEW']);
                    fputcsv($file, ['Pocket Name', 'Allocated', 'Spent (Period)', 'Remaining', 'Utilization']);
                    
                    foreach ($pockets as $pocket) {
                        $spent = Expense::where('user_id', $user->id)
                            ->where('pocket_id', $pocket->id)
                            ->where('is_archived', false)
                            ->whereBetween('expense_date', [$startDate, $endDate])
                            ->sum('amount');
                        
                        $allocated = $pocket->allocated ?? 0;
                        $remaining = $allocated - $spent;
                        $utilization = $allocated > 0 ? round(($spent / $allocated) * 100, 1) : 0;
                        
                        fputcsv($file, [
                            $pocket->name,
                            number_format($allocated, 2),
                            number_format($spent, 2),
                            number_format($remaining, 2),
                            $utilization . '%',
                        ]);
                    }
                    fputcsv($file, []);
                } else {
                    fputcsv($file, ['No pockets created yet.']);
                    fputcsv($file, []);
                }
                
                // Expenses
                fputcsv($file, ['EXPENSES']);
                fputcsv($file, [
                    'Date', 
                    'Description', 
                    'Pocket', 
                    'Amount',
                    'Payment Method',
                    'Merchant',
                    'Notes'
                ]);

                if ($expenses->isNotEmpty()) {
                    foreach ($expenses as $expense) {
                        fputcsv($file, [
                            $expense->expense_date,
                            $expense->description,
                            $expense->pocket?->name ?? 'Uncategorized',
                            number_format($expense->amount, 2),
                            $expense->payment_method ?? 'N/A',
                            $expense->merchant ?? 'N/A',
                            $expense->notes ?? '',
                        ]);
                    }
                } else {
                    fputcsv($file, ['No expenses recorded in this period.']);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        } catch (\Exception $exception) {
            Log::error('CSV export error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to export CSV.',
            ], 500);
        }
    }

/**
 * Export report as PDF using PocketController data directly.
 */
public function exportPdf(Request $request)
{
    try {
        if (!class_exists('\Barryvdh\DomPDF\Facade\Pdf')) {
            return response()->json([
                'error' => 'PDF export is not available. Please run: composer require barryvdh/laravel-dompdf',
            ], 500);
        }

        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // USE THE EXACT SAME LOGIC AS PocketController::apiIndex
        $pockets = Pocket::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderBy('name')
            ->get();

        // Format pockets the same way as PocketController
        $formattedPockets = $pockets->map(function ($pocket) {
            return [
                'id' => $pocket->id,
                'name' => $pocket->name,
                'icon' => $pocket->icon ?? 'mdi:folder',
                'color' => $pocket->color ?? '#5CB85C',
                'balance' => $pocket->balance,
                'allocated' => $pocket->allocated,
                'spent' => $pocket->spent,
                'description' => $pocket->description,
                'is_default' => $pocket->is_default,
            ];
        });

        // Add period_spent and period_utilization to each pocket
        foreach ($pockets as $pocket) {
            $spent = Expense::where('user_id', $user->id)
                ->where('pocket_id', $pocket->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->sum('amount');
            
            $pocket->period_spent = $spent;
            $pocket->period_utilization = $pocket->allocated > 0 
                ? round(($spent / $pocket->allocated) * 100, 1) 
                : 0;
        }

        // Get expenses
        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->with('pocket')
            ->orderBy('expense_date', 'desc')
            ->get();

        // Get savings goals
        $savings = SavingsGoal::where('user_id', $user->id)
            ->where('is_archived', false)
            ->get();

        // Calculate summary
        $totalIncome = Expense::where('user_id', $user->id)
            ->where('type', 'income')
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');

        $totalExpenses = Expense::where('user_id', $user->id)
            ->where('type', 'expense')
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');

        $totalSavings = $savings->sum('current_amount');
        $safeBalance = $user->safe_balance ?? 0;
        $netBalance = $totalIncome - $totalExpenses;
        $largestExpense = $expenses->max('amount') ?? 0;
        $transactionCount = $expenses->count();

        // Get monthly trend
        $monthlyTrend = [];
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

        // PREPARE DATA FOR VIEW - USE THE POCKETS COLLECTION (NOT FORMATTED)
        $data = [
            'user' => $user,
            'currency' => '₱',
            'generated_at' => now()->format('F j, Y g:i A'),
            'period' => [
                'start' => Carbon::parse($startDate)->format('M d, Y'),
                'end' => Carbon::parse($endDate)->format('M d, Y'),
            ],
            'summary' => [
                'total_income' => $totalIncome,
                'total_expenses' => $totalExpenses,
                'total_savings' => $totalSavings,
                'safe_balance' => $safeBalance,
                'net_balance' => $netBalance,
                'largest_expense' => $largestExpense,
                'transaction_count' => $transactionCount,
            ],
            'expenses' => $expenses,
            'pockets' => $pockets,  // PASS THE ORIGINAL COLLECTION, NOT FORMATTED
            'savings' => $savings,
            'monthly_trend' => $monthlyTrend,
        ];

        // DEBUG: Log what's being passed
        \Log::info('=== PDF EXPORT DEBUG ===');
        \Log::info('Pockets count: ' . $data['pockets']->count());
        \Log::info('Pocket names: ' . $data['pockets']->pluck('name')->implode(', '));
        \Log::info('Has user: ' . (isset($data['user']) ? 'YES' : 'NO'));
        \Log::info('User name: ' . $data['user']->name);
        \Log::info('Has currency: ' . (isset($data['currency']) ? 'YES' : 'NO'));
        \Log::info('Expenses count: ' . $data['expenses']->count());
        \Log::info('Savings count: ' . $data['savings']->count());

        // Load the PDF view
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.analytics', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('ledgerleaf_report_' . date('Y-m-d') . '.pdf');
        
    } catch (\Exception $exception) {
        \Log::error('PDF export error: ' . $exception->getMessage());
        \Log::error($exception->getTraceAsString());

        return response()->json([
            'error' => 'Failed to generate PDF: ' . $exception->getMessage(),
        ], 500);
    }
}
}