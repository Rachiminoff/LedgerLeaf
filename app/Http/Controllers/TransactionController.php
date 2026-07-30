<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display the Transactions page
     */
    public function index(Request $request)
    {
        // If it's an API request, return JSON
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->apiIndex($request);
        }

        // Otherwise, render the Inertia page
        return Inertia::render('Transactions/Index');
    }

    /**
     * API endpoint for transactions (returns JSON)
     */
    public function apiIndex(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Get all audit logs for the authenticated user only
            $query = AuditLog::where('user_id', $user->id)
                ->with(['user']);

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('action', 'like', '%' . $search . '%')
                      ->orWhere('table_name', 'like', '%' . $search . '%')
                      ->orWhere('old_values', 'like', '%' . $search . '%')
                      ->orWhere('new_values', 'like', '%' . $search . '%')
                      ->orWhere('ip_address', 'like', '%' . $search . '%');
                });
            }

            // Apply action filter (exact match)
            if ($request->filled('action')) {
                $query->where('action', $request->action);
            }

            // Apply table_name filter
            if ($request->filled('table_name')) {
                $query->where('table_name', $request->table_name);
            }

            // Apply date range filter
            if ($request->filled('date_range')) {
                $this->applyDateFilter($query, $request->date_range);
            }

            // Apply sorting
            $sortBy = $request->input('sort_by', 'newest');
            $this->applySorting($query, $sortBy);

            $perPage = $request->input('per_page', 15);
            $transactions = $query->paginate($perPage);

            // Format the data with readable action labels
            $formattedData = collect($transactions->items())->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'action_label' => $this->getActionLabel($log->action),
                    'table_name' => $log->table_name,
                    'table_label' => $this->getTableLabel($log->table_name),
                    'old_values' => $log->old_values ? json_decode($log->old_values, true) : null,
                    'new_values' => $log->new_values ? json_decode($log->new_values, true) : null,
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'created_at' => $log->created_at,
                    'user' => $log->user ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                        'email' => $log->user->email,
                    ] : null,
                ];
            });

            // Get summary stats
            $summary = $this->getSummary($user);

            return response()->json([
                'data' => $formattedData,
                'meta' => [
                    'current_page' => $transactions->currentPage(),
                    'last_page' => $transactions->lastPage(),
                    'per_page' => $transactions->perPage(),
                    'total' => $transactions->total(),
                    'from' => $transactions->firstItem(),
                    'to' => $transactions->lastItem(),
                ],
                'summary' => $summary,
                'filters' => [
                    'search' => $request->search,
                    'action' => $request->action,
                    'table_name' => $request->table_name,
                    'date_range' => $request->date_range,
                    'sort_by' => $request->sort_by,
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Transaction API error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Get transaction summary
     */
    private function getSummary($user)
    {
        $total = AuditLog::where('user_id', $user->id)->count();
        
        // Get count by action
        $byAction = AuditLog::where('user_id', $user->id)
            ->selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'action' => $item->action,
                    'action_label' => $this->getActionLabel($item->action),
                    'count' => $item->count,
                ];
            });

        // Get count by table
        $byTable = AuditLog::where('user_id', $user->id)
            ->selectRaw('table_name, COUNT(*) as count')
            ->groupBy('table_name')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'table_name' => $item->table_name,
                    'table_label' => $this->getTableLabel($item->table_name),
                    'count' => $item->count,
                ];
            });

        // Get today's activity
        $today = AuditLog::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->count();

        // Get this week's activity
        $thisWeek = AuditLog::where('user_id', $user->id)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        // Get this month's activity
        $thisMonth = AuditLog::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            'total' => $total,
            'today' => $today,
            'this_week' => $thisWeek,
            'this_month' => $thisMonth,
            'by_action' => $byAction,
            'by_table' => $byTable,
        ];
    }

    /**
     * Get human-readable action label
     */
    private function getActionLabel($action)
    {
        $labels = [
            'deposit' => 'Deposit',
            'create_pocket' => 'Create Pocket',
            'update_pocket' => 'Update Pocket',
            'archive_pocket' => 'Archive Pocket',
            'delete_pocket' => 'Delete Pocket',
            'restore_pocket' => 'Restore Pocket',
            'refund_pocket' => 'Refund Pocket',
            'allocate_funds' => 'Allocate Funds',
            'transfer_funds' => 'Transfer Funds',
            'deduct_pocket' => 'Deduct from Pocket',
            'create_expense' => 'Create Expense',
            'update_expense' => 'Update Expense',
            'delete_expense' => 'Delete Expense',
            'archive_expense' => 'Archive Expense',
            'restore_expense' => 'Restore Expense',
            'create_savings_goal' => 'Create Savings Goal',
            'update_savings_goal' => 'Update Savings Goal',
            'archive_savings_goal' => 'Archive Savings Goal',
            'restore_savings_goal' => 'Restore Savings Goal',
            'delete_savings_goal' => 'Delete Savings Goal',
            'deposit_savings' => 'Deposit to Savings',
            'withdraw_savings' => 'Withdraw from Savings',
            'update_profile' => 'Update Profile',
            'change_password' => 'Change Password',
            'login' => 'Login',
            'logout' => 'Logout',
        ];

        return $labels[$action] ?? ucwords(str_replace('_', ' ', $action));
    }

    /**
     * Get human-readable table label
     */
    private function getTableLabel($table)
    {
        $labels = [
            'users' => 'Users',
            'pockets' => 'Pockets',
            'expenses' => 'Expenses',
            'transactions' => 'Transactions',
            'allocations' => 'Allocations',
            'savings_goals' => 'Savings Goals',
            'savings_deposits' => 'Savings Deposits',
            'savings_withdrawals' => 'Savings Withdrawals',
            'budgets' => 'Budgets',
            'categories' => 'Categories',
        ];

        return $labels[$table] ?? ucwords(str_replace('_', ' ', $table));
    }

    /**
     * Apply date filter
     */
    private function applyDateFilter($query, $range)
    {
        switch ($range) {
            case 'today':
                $query->whereDate('created_at', today());
                break;
            case 'this_week':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'this_month':
                $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
                break;
            case 'last_3_months':
                $query->whereDate('created_at', '>=', now()->subMonths(3));
                break;
            default:
                // No date filter
                break;
        }
    }

    /**
     * Apply sorting
     */
    private function applySorting($query, $sortBy)
    {
        switch ($sortBy) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }
    }
}