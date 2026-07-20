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
     * Get monthly report data.
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

            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->get();

            $totalExpenses = $expenses->sum('amount');
            $totalIncome = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->sum('amount');

            $pocketBreakdown = $expenses->groupBy('pocket_id')->map(function ($items, $pocketId) {
                $pocket = $items->first()->pocket;
                return [
                    'pocket_name' => $pocket?->name ?? 'Uncategorized',
                    'total' => $items->sum('amount'),
                    'percentage' => 0,
                ];
            })->values()->toArray();

            $total = array_sum(array_column($pocketBreakdown, 'total'));
            foreach ($pocketBreakdown as &$item) {
                $item['percentage'] = $total > 0 ? round(($item['total'] / $total) * 100, 1) : 0;
            }

            return response()->json([
                'period' => [
                    'start' => $startDate->format('M d, Y'),
                    'end' => $endDate->format('M d, Y'),
                ],
                'total_income' => $totalIncome,
                'total_expenses' => $totalExpenses,
                'net_balance' => $totalIncome - $totalExpenses,
                'pocket_breakdown' => $pocketBreakdown,
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
     * Get yearly report data.
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

            $monthlyData = [];

            for ($month = 1; $month <= 12; $month++) {
                $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
                $monthEnd = Carbon::create($year, $month, 1)->endOfMonth();

                $income = Transaction::where('user_id', $user->id)
                    ->where('type', 'income')
                    ->whereBetween('date', [$monthStart, $monthEnd])
                    ->sum('amount');

                $expenses = Expense::where('user_id', $user->id)
                    ->where('is_archived', false)
                    ->whereBetween('expense_date', [$monthStart, $monthEnd])
                    ->sum('amount');

                $monthlyData[] = [
                    'month' => $monthStart->format('M'),
                    'income' => $income,
                    'expenses' => $expenses,
                    'savings' => $income - $expenses,
                ];
            }

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
     * Get category report data.
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

            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->get();

            $categoryData = $expenses->groupBy('pocket_id')->map(function ($items, $pocketId) {
                $pocket = $items->first()->pocket;
                return [
                    'pocket_id' => $pocketId,
                    'pocket_name' => $pocket?->name ?? 'Uncategorized',
                    'color' => $pocket?->color ?? '#6B7280',
                    'icon' => $pocket?->icon ?? 'mdi:folder',
                    'total' => $items->sum('amount'),
                    'count' => $items->count(),
                ];
            })->values()->toArray();

            $total = array_sum(array_column($categoryData, 'total'));
            foreach ($categoryData as &$item) {
                $item['percentage'] = $total > 0 ? round(($item['total'] / $total) * 100, 1) : 0;
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
                'total' => $total,
            ]);
        } catch (\Exception $exception) {
            Log::error('Category report error: ' . $exception->getMessage());

            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Get full report data for export
     */
    public function getFullReport(Request $request)
    {
        try {
            $user = $request->user();
            $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

            // Expenses
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->orderBy('expense_date', 'desc')
                ->get();

            // Savings Goals
            $savings = SavingsGoal::where('user_id', $user->id)
                ->where('is_archived', false)
                ->get();

            // Pockets
            $pockets = Pocket::where('user_id', $user->id)
                ->where('is_archived', false)
                ->get();

            // Budgets
            $budgets = Budget::where('user_id', $user->id)
                ->where('month_year', Carbon::now()->format('Y-m-01'))
                ->with('categories')
                ->first();

            // Transactions
            $transactions = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->orderBy('date', 'desc')
                ->get();

            // Summary
            $totalExpenses = $expenses->sum('amount');
            $totalIncome = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->sum('amount');
            $totalSavings = $savings->sum('current_amount');
            $safeBalance = $user->safe_balance;

            return response()->json([
                'period' => [
                    'start' => Carbon::parse($startDate)->format('M d, Y'),
                    'end' => Carbon::parse($endDate)->format('M d, Y'),
                ],
                'summary' => [
                    'total_income' => $totalIncome,
                    'total_expenses' => $totalExpenses,
                    'total_savings' => $totalSavings,
                    'safe_balance' => $safeBalance,
                    'net_balance' => $totalIncome - $totalExpenses,
                ],
                'expenses' => $expenses,
                'pockets' => $pockets,
                'savings' => $savings,
                'budgets' => $budgets,
                'transactions' => $transactions,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
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

            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->orderBy('expense_date', 'desc')
                ->get();

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="report_' . date('Y-m-d') . '.csv"',
            ];

            $callback = function () use ($expenses, $user) {
                $file = fopen('php://output', 'w');
                
                // Header row with more columns
                fputcsv($file, [
                    'Date', 
                    'Description', 
                    'Pocket', 
                    'Amount',
                    'Payment Method',
                    'Merchant',
                    'Type'
                ]);

                foreach ($expenses as $expense) {
                    fputcsv($file, [
                        $expense->expense_date,
                        $expense->description,
                        $expense->pocket?->name ?? 'Uncategorized',
                        number_format($expense->amount, 2),
                        $expense->payment_method ?? 'N/A',
                        $expense->merchant ?? 'N/A',
                        $expense->type ?? 'expense',
                    ]);
                }

                // Add summary rows
                fputcsv($file, []);
                fputcsv($file, ['Summary']);
                fputcsv($file, ['Total Expenses', number_format($expenses->sum('amount'), 2)]);
                fputcsv($file, ['Total Records', $expenses->count()]);

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
     * Export report as PDF.
     *
     * @param Request $request
     * @return mixed
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
            $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

            // Get all data
            $expenses = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->with('pocket')
                ->orderBy('expense_date', 'desc')
                ->get();

            $pockets = Pocket::where('user_id', $user->id)
                ->where('is_archived', false)
                ->get();

            $savings = SavingsGoal::where('user_id', $user->id)
                ->where('is_archived', false)
                ->get();

            $totalExpenses = $expenses->sum('amount');
            $totalIncome = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->sum('amount');
            $totalSavings = $savings->sum('current_amount');
            $safeBalance = $user->safe_balance;

            $data = [
                'user' => $user,
                'expenses' => $expenses,
                'pockets' => $pockets,
                'savings' => $savings,
                'period' => [
                    'start' => Carbon::parse($startDate)->format('M d, Y'),
                    'end' => Carbon::parse($endDate)->format('M d, Y'),
                ],
                'summary' => [
                    'total_income' => $totalIncome,
                    'total_expenses' => $totalExpenses,
                    'total_savings' => $totalSavings,
                    'safe_balance' => $safeBalance,
                    'net_balance' => $totalIncome - $totalExpenses,
                ],
                'generated_at' => now()->format('F j, Y g:i A'),
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.report', $data);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('report_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $exception) {
            Log::error('PDF export error: ' . $exception->getMessage());

            return response()->json([
                'error' => 'Failed to export PDF: ' . $exception->getMessage(),
            ], 500);
        }
    }
}