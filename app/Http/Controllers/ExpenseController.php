<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Pocket;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display the Expenses page (web route)
     */
    public function index(Request $request)
    {
        // If it's an API request, return JSON
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->apiIndex($request);
        }

        // Otherwise, render the Inertia page
        $user = $request->user();

        $expenses = Expense::with(['pocket'])
            ->where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderBy('expense_date', 'desc')
            ->paginate(15);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses->items(),
            'pagination' => [
                'current_page' => $expenses->currentPage(),
                'last_page' => $expenses->lastPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
                'from' => $expenses->firstItem(),
                'to' => $expenses->lastItem(),
            ],
        ]);
    }

    /**
     * API endpoint for expenses (returns JSON)
     */
    public function apiIndex(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = Expense::with(['pocket'])
                ->where('user_id', $user->id);

            // Handle is_archived filter
            if ($request->has('is_archived')) {
                $isArchived = filter_var($request->is_archived, FILTER_VALIDATE_BOOLEAN);
                $query->where('is_archived', $isArchived);
            } else {
                // Default: show only active expenses (not archived)
                $query->where('is_archived', false);
            }

            // Apply filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('description', 'LIKE', '%' . $search . '%');
            }

            if ($request->filled('pocket_id')) {
                $query->where('pocket_id', $request->pocket_id);
            }

            if ($request->filled('date_range')) {
                $this->applyDateFilter($query, $request->date_range);
            }

            // Apply sorting
            $sortBy = $request->sort_by ?? 'newest';
            $this->applySorting($query, $sortBy);

            $perPage = $request->input('per_page', 15);
            $expenses = $query->paginate($perPage);

            // Get summary, stats, and insights
            $summary = $this->getSummary($user);
            $stats = $this->getStats($user);
            $insights = $this->getInsights($user);

            return response()->json([
                'data' => $expenses->items(),
                'meta' => [
                    'current_page' => $expenses->currentPage(),
                    'last_page' => $expenses->lastPage(),
                    'per_page' => $expenses->perPage(),
                    'total' => $expenses->total(),
                    'from' => $expenses->firstItem(),
                    'to' => $expenses->lastItem(),
                ],
                'summary' => $summary,
                'stats' => $stats,
                'insights' => $insights,
            ]);

        } catch (\Exception $e) {
            \Log::error('Expense API error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * Store a new expense
     * Also logs the creation in audit log
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'description' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0.01',
                'expense_date' => 'required|date',
                'pocket_id' => 'nullable|exists:pockets,id',
                'payment_method' => 'nullable|string',
                'merchant' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            $user = $request->user();

            $expense = Expense::create([
                'user_id' => $user->id,
                'pocket_id' => $validated['pocket_id'] ?? null,
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'expense_date' => $validated['expense_date'],
                'payment_method' => $validated['payment_method'] ?? null,
                'merchant' => $validated['merchant'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'type' => 'expense',
                'is_archived' => false,
            ]);

            // Create audit log for expense creation
            $this->createAuditLog(
                $user->id,
                'create_expense',
                'expenses',
                $expense->id,
                null,
                $expense->toArray(),
                $request
            );

            return response()->json([
                'message' => 'Expense created successfully',
                'expense' => $expense->load(['pocket'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Update an expense
     * Also logs the update in audit log
     */
    public function update(Request $request, Expense $expense)
    {
        try {
            if ($expense->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'description' => 'sometimes|string|max:255',
                'amount' => 'sometimes|numeric|min:0.01',
                'expense_date' => 'sometimes|date',
                'pocket_id' => 'nullable|exists:pockets,id',
                'payment_method' => 'nullable|string',
                'merchant' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            $oldValues = $expense->toArray();

            DB::transaction(function () use ($expense, $validated) {
                $newPocketId = $validated['pocket_id'] ?? $expense->pocket_id;
                $newAmount = $validated['amount'] ?? $expense->amount;
                
                // If pocket changed
                if ($newPocketId != $expense->pocket_id) {
                    // Refund old pocket
                    if ($expense->pocket_id) {
                        $oldPocket = Pocket::find($expense->pocket_id);
                        if ($oldPocket) {
                            $oldPocket->spent -= $expense->amount;
                            $oldPocket->balance += $expense->amount;
                            $oldPocket->save();
                        }
                    }
                    // Deduct from new pocket
                    if ($newPocketId) {
                        $newPocket = Pocket::find($newPocketId);
                        if ($newPocket) {
                            $available = $newPocket->allocated - $newPocket->spent;
                            if ($newAmount > $available) {
                                throw new \Exception('Insufficient balance in pocket');
                            }
                            $newPocket->spent += $newAmount;
                            $newPocket->balance -= $newAmount;
                            $newPocket->save();
                        }
                    }
                } elseif ($expense->pocket_id && isset($validated['amount']) && $validated['amount'] != $expense->amount) {
                    // Amount changed for same pocket
                    $pocket = Pocket::find($expense->pocket_id);
                    if ($pocket) {
                        $amountDiff = $validated['amount'] - $expense->amount;
                        if ($amountDiff > 0) {
                            $available = $pocket->allocated - $pocket->spent;
                            if ($amountDiff > $available) {
                                throw new \Exception('Insufficient balance');
                            }
                            $pocket->spent += $amountDiff;
                            $pocket->balance -= $amountDiff;
                        } else {
                            // Refund the difference (negative amount)
                            $pocket->spent += $amountDiff;
                            $pocket->balance -= $amountDiff;
                        }
                        $pocket->save();
                    }
                }

                $expense->update($validated);
            });

            $newValues = $expense->fresh()->toArray();

            // Create audit log for expense update
            $this->createAuditLog(
                $request->user()->id,
                'update_expense',
                'expenses',
                $expense->id,
                $oldValues,
                $newValues,
                $request
            );

            return response()->json([
                'message' => 'Expense updated successfully',
                'expense' => $expense->load(['pocket'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Delete an expense (with refund)
     * Also logs the deletion in audit log
     */
    public function destroy(Expense $expense)
    {
        try {
            if ($expense->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = auth()->user();
            $oldValues = $expense->toArray();

            DB::transaction(function () use ($expense) {
                // Refund the amount back to the pocket
                if ($expense->pocket_id) {
                    $pocket = Pocket::find($expense->pocket_id);
                    if ($pocket) {
                        $pocket->spent -= $expense->amount;
                        $pocket->balance += $expense->amount;
                        $pocket->save();
                    }
                }

                $expense->delete();
            });

            // Create audit log for expense deletion
            $this->createAuditLog(
                $user->id,
                'delete_expense',
                'expenses',
                $expense->id,
                $oldValues,
                ['deleted' => true, 'refunded' => true],
                request()
            );

            return response()->json([
                'message' => 'Expense deleted successfully',
                'refunded' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Archive an expense (with refund)
     * Also logs the archive action in audit log
     */
    public function archive(Expense $expense)
    {
        try {
            if ($expense->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = auth()->user();
            $oldValues = $expense->toArray();

            DB::transaction(function () use ($expense) {
                // Refund the amount back to the pocket
                if ($expense->pocket_id) {
                    $pocket = Pocket::find($expense->pocket_id);
                    if ($pocket) {
                        $pocket->spent -= $expense->amount;
                        $pocket->balance += $expense->amount;
                        $pocket->save();
                    }
                }

                $expense->update(['is_archived' => true]);
            });

            $newValues = $expense->fresh()->toArray();

            // Create audit log for expense archive
            $this->createAuditLog(
                $user->id,
                'archive_expense',
                'expenses',
                $expense->id,
                $oldValues,
                $newValues,
                request()
            );

            return response()->json([
                'message' => 'Expense archived successfully',
                'refunded' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Restore an archived expense
     * Also logs the restore action in audit log
     */
    public function restore(Expense $expense)
    {
        try {
            if ($expense->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = auth()->user();
            $oldValues = $expense->toArray();

            DB::transaction(function () use ($expense) {
                // Deduct the amount back from the pocket
                if ($expense->pocket_id) {
                    $pocket = Pocket::find($expense->pocket_id);
                    if ($pocket) {
                        $pocket->spent += $expense->amount;
                        $pocket->balance -= $expense->amount;
                        $pocket->save();
                    }
                }

                $expense->update(['is_archived' => false]);
            });

            $newValues = $expense->fresh()->toArray();

            // Create audit log for expense restore
            $this->createAuditLog(
                $user->id,
                'restore_expense',
                'expenses',
                $expense->id,
                $oldValues,
                $newValues,
                request()
            );

            return response()->json([
                'message' => 'Expense restored successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Export expenses to CSV
     */
    public function export(Request $request)
    {
        $user = $request->user();
        
        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderBy('expense_date', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="expenses_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($expenses) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Date', 'Description', 'Pocket', 'Amount', 'Payment Method', 'Merchant', 'Notes']);

            foreach ($expenses as $expense) {
                fputcsv($file, [
                    $expense->expense_date,
                    $expense->description,
                    $expense->pocket?->name ?? 'N/A',
                    $expense->amount,
                    $expense->payment_method ?? '',
                    $expense->merchant ?? '',
                    $expense->notes ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get expense statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        
        $total = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->sum('amount');
            
        $count = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->count();
            
        $average = $count > 0 ? $total / $count : 0;
        
        return response()->json([
            'total' => $total,
            'count' => $count,
            'average' => $average,
        ]);
    }

    // -- Helper Methods ---------------------------------------------

    private function applyDateFilter($query, $range)
    {
        switch ($range) {
            case 'today':
                $query->whereDate('expense_date', today());
                break;
            case 'this_week':
                $query->whereBetween('expense_date', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'this_month':
                $query->whereMonth('expense_date', now()->month)
                    ->whereYear('expense_date', now()->year);
                break;
            case 'last_3_months':
                $query->whereDate('expense_date', '>=', now()->subMonths(3));
                break;
            default:
                $query->whereMonth('expense_date', now()->month)
                    ->whereYear('expense_date', now()->year);
        }
    }

    private function applySorting($query, $sortBy)
    {
        switch ($sortBy) {
            case 'newest':
                $query->orderBy('expense_date', 'desc');
                break;
            case 'oldest':
                $query->orderBy('expense_date', 'asc');
                break;
            case 'highest':
                $query->orderBy('amount', 'desc');
                break;
            case 'lowest':
                $query->orderBy('amount', 'asc');
                break;
            default:
                $query->orderBy('expense_date', 'desc');
        }
    }

    /**
     * Get summary data for expense dashboard
     */
    private function getSummary($user)
    {
        // Get today's spending
        $today = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereDate('expense_date', today())
            ->sum('amount');
        
        // Get this week's spending
        $thisWeek = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereBetween('expense_date', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('amount');
        
        // Get this month's spending
        $thisMonth = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year)
            ->sum('amount');
        
        // Get largest expense
        $largest = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->max('amount') ?? 0;
        
        // Calculate average daily (based on current month)
        $daysInMonth = now()->daysInMonth;
        $averageDaily = $daysInMonth > 0 ? $thisMonth / $daysInMonth : 0;
        
        // Calculate trends (compare with previous month)
        $prevMonth = now()->subMonth();
        $prevMonthTotal = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereMonth('expense_date', $prevMonth->month)
            ->whereYear('expense_date', $prevMonth->year)
            ->sum('amount');
        
        $trend = $prevMonthTotal > 0 ? (($thisMonth - $prevMonthTotal) / $prevMonthTotal) * 100 : 0;
        
        return [
            'today' => $today,
            'this_week' => $thisWeek,
            'this_month' => $thisMonth,
            'average_daily' => $averageDaily,
            'largest_expense' => $largest,
            'total_expenses' => $thisMonth,
            'trends' => [
                'today' => $trend,
                'this_week' => $trend,
                'this_month' => $trend,
            ],
            'monthly_budget' => 10000,
            'days_in_month' => $daysInMonth,
        ];
    }

    /**
     * Get spending statistics
     */
    private function getStats($user)
    {
        // Get top spending by pocket
        $topSpending = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereNotNull('pocket_id')
            ->selectRaw('pocket_id, SUM(amount) as total')
            ->groupBy('pocket_id')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $pocket = Pocket::find($item->pocket_id);
                return [
                    'name' => $pocket?->name ?? 'Uncategorized',
                    'total' => $item->total,
                    'color' => $pocket?->color ?? '#5CB85C',
                    'icon' => $pocket?->icon ?? 'mdi:folder',
                ];
            });
        
        $totalSpent = $topSpending->sum('total');
        
        // Calculate percentages
        $topSpending = $topSpending->map(function ($item) use ($totalSpent) {
            $item['percentage'] = $totalSpent > 0 ? ($item['total'] / $totalSpent) * 100 : 0;
            return $item;
        });
        
        // Get monthly trend (last 6 months)
        $monthlyTrend = collect(range(5, 0))->map(function ($monthOffset) use ($user) {
            $date = now()->subMonths($monthOffset);
            $amount = Expense::where('user_id', $user->id)
                ->where('is_archived', false)
                ->whereMonth('expense_date', $date->month)
                ->whereYear('expense_date', $date->year)
                ->sum('amount');
            
            return [
                'month' => $date->format('M Y'),
                'amount' => $amount,
            ];
        });
        
        return [
            'topCategories' => $topSpending,
            'total_spent' => $totalSpent,
            'monthlyTrend' => $monthlyTrend,
        ];
    }

    /**
     * Get insights for the user
     */
    private function getInsights($user)
    {
        $insights = [];
        
        // Total monthly spending
        $totalExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year)
            ->sum('amount');
        
        if ($totalExpenses > 0) {
            $insights[] = [
                'id' => 'total_spent',
                'type' => 'neutral',
                'title' => 'Monthly Spending',
                'description' => 'You have spent ₱' . number_format($totalExpenses, 2) . ' this month.',
            ];
        }
        
        // Check for largest expense
        $largest = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderBy('amount', 'desc')
            ->first();
        
        if ($largest) {
            $insights[] = [
                'id' => 'largest_expense',
                'type' => 'positive',
                'title' => 'Largest Expense',
                'description' => 'Your largest expense is ₱' . number_format($largest->amount, 2) . ' for "' . ($largest->description ?? 'Unknown') . '"',
            ];
        }
        
        // Check for recent activity
        $recent = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->latest()
            ->first();
        
        if ($recent) {
            $insights[] = [
                'id' => 'recent_expense',
                'type' => 'positive',
                'title' => 'Recent Activity',
                'description' => 'Last expense: ' . ($recent->description ?? 'No description') . ' (₱' . number_format($recent->amount, 2) . ')',
            ];
        }
        
        // Check if no expenses
        $count = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->count();
        
        if ($count === 0) {
            $insights[] = [
                'id' => 'no_data',
                'type' => 'neutral',
                'title' => 'No expenses yet',
                'description' => 'Start tracking your spending by adding your first expense.',
            ];
        }
        
        return $insights;
    }

    /**
     * Helper method to create audit log entries
     * Records all actions performed on expenses
     */
    private function createAuditLog($userId, $action, $tableName, $recordId, $oldValues, $newValues, $request)
    {
        try {
            AuditLog::create([
                'user_id' => $userId,
                'action' => $action,
                'table_name' => $tableName,
                'record_id' => $recordId,
                'old_values' => $oldValues ? json_encode($oldValues) : null,
                'new_values' => $newValues ? json_encode($newValues) : null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Log error but don't break the main operation
            \Log::error('Failed to create audit log: ' . $e->getMessage());
        }
    }
}