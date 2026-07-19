<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

            // Get all audit logs (transactions)
            $query = AuditLog::where('user_id', $user->id)
                ->with(['user']);

            // Apply filters
            if ($request->filled('action')) {
                $query->where('action', 'like', '%' . $request->action . '%');
            }

            if ($request->filled('table_name')) {
                $query->where('table_name', $request->table_name);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('action', 'like', '%' . $search . '%')
                      ->orWhere('table_name', 'like', '%' . $search . '%')
                      ->orWhere('old_values', 'like', '%' . $search . '%')
                      ->orWhere('new_values', 'like', '%' . $search . '%');
                });
            }

            if ($request->filled('date_range')) {
                $this->applyDateFilter($query, $request->date_range);
            }

            // Apply sorting
            $sortBy = $request->sort_by ?? 'newest';
            $this->applySorting($query, $sortBy);

            $perPage = $request->input('per_page', 15);
            $transactions = $query->paginate($perPage);

            // Format the data
            $formattedData = $transactions->items();

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
        
        $byAction = AuditLog::where('user_id', $user->id)
            ->selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->get()
            ->map(function ($item) {
                return [
                    'action' => $item->action,
                    'count' => $item->count,
                ];
            });

        return [
            'total' => $total,
            'by_action' => $byAction,
        ];
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
                $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
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