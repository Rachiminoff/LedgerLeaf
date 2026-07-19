<?php

namespace App\Http\Controllers;

use App\Models\SavingsGoal;
use App\Models\SavingsTransaction;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SavingsGoalController extends Controller
{
    /**
     * Display the Savings page
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $goals = SavingsGoal::where('user_id', $user->id)
            ->with(['transactions' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        $safeBalance = $user->safe_balance ?? 0;
        $totalSaved = $goals->where('is_archived', false)->sum('current_amount');
        $activeGoals = $goals->where('is_archived', false)->where('is_completed', false)->count();
        $completedGoals = $goals->where('is_archived', false)->where('is_completed', true)->count();

        $recentTransactions = SavingsTransaction::where('user_id', $user->id)
            ->with('savingsGoal')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Savings/Index', [
            'goals' => $goals,
            'summary' => [
                'safe_balance' => $safeBalance,
                'total_saved' => $totalSaved,
                'active_goals' => $activeGoals,
                'completed_goals' => $completedGoals,
            ],
            'recent_transactions' => $recentTransactions,
        ]);
    }

    /**
     * Store a new savings goal
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'target_amount' => 'required|numeric|min:0.01',
                'target_date' => 'nullable|date|after:today',
                'description' => 'nullable|string|max:1000',
            ]);

            $user = $request->user();

            $exists = SavingsGoal::where('user_id', $user->id)
                ->where('name', $validated['name'])
                ->where('is_archived', false)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'A goal with this name already exists',
                    'errors' => ['name' => ['A goal with this name already exists']]
                ], 422);
            }

            $goal = SavingsGoal::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'target_amount' => $validated['target_amount'],
                'target_date' => $validated['target_date'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'create_savings_goal',
                'savings_goals',
                $goal->id,
                null,
                $goal->toArray(),
                $request
            );

            return response()->json([
                'message' => 'Savings goal created successfully',
                'goal' => $goal,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create goal: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deposit into a savings goal
     */
    public function deposit(Request $request, SavingsGoal $goal)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'notes' => 'nullable|string|max:500',
            ]);

            $user = $request->user();

            if ($goal->is_completed) {
                return response()->json(['message' => 'This goal is already completed'], 400);
            }

            if ($goal->is_archived) {
                return response()->json(['message' => 'This goal is archived'], 400);
            }

            if ($validated['amount'] > $user->safe_balance) {
                return response()->json([
                    'message' => 'Insufficient safe balance',
                    'available' => $user->safe_balance,
                    'requested' => $validated['amount']
                ], 400);
            }

            $remaining = $goal->target_amount - $goal->current_amount;
            if ($validated['amount'] > $remaining) {
                return response()->json([
                    'message' => 'Amount exceeds remaining goal amount',
                    'remaining' => $remaining,
                    'requested' => $validated['amount']
                ], 400);
            }

            $oldSafeBalance = $user->safe_balance;
            $oldCurrentAmount = $goal->current_amount;

            DB::transaction(function () use ($user, $goal, $validated) {
                $user->safe_balance -= $validated['amount'];
                $user->save();

                $goal->current_amount += $validated['amount'];

                if ($goal->current_amount >= $goal->target_amount) {
                    $goal->is_completed = true;
                    $goal->completed_at = now();
                }

                $goal->save();

                SavingsTransaction::create([
                    'user_id' => $user->id,
                    'savings_goal_id' => $goal->id,
                    'type' => 'deposit',
                    'amount' => $validated['amount'],
                    'notes' => $validated['notes'] ?? null,
                    'balance_after' => $goal->current_amount,
                ]);
            });

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'deposit_savings',
                'savings_goals',
                $goal->id,
                [
                    'safe_balance' => $oldSafeBalance,
                    'goal_current_amount' => $oldCurrentAmount,
                ],
                [
                    'safe_balance' => $user->fresh()->safe_balance,
                    'goal_current_amount' => $goal->fresh()->current_amount,
                ],
                $request
            );

            return response()->json([
                'message' => 'Deposit successful',
                'goal' => $goal->fresh(),
                'new_safe_balance' => $user->fresh()->safe_balance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to deposit: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Withdraw from a savings goal
     */
    public function withdraw(Request $request, SavingsGoal $goal)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'notes' => 'nullable|string|max:500',
            ]);

            $user = $request->user();

            if ($goal->is_archived) {
                return response()->json(['message' => 'This goal is archived'], 400);
            }

            if ($validated['amount'] > $goal->current_amount) {
                return response()->json([
                    'message' => 'Insufficient saved amount',
                    'available' => $goal->current_amount,
                    'requested' => $validated['amount']
                ], 400);
            }

            $oldSafeBalance = $user->safe_balance;
            $oldCurrentAmount = $goal->current_amount;

            DB::transaction(function () use ($user, $goal, $validated) {
                $user->safe_balance += $validated['amount'];
                $user->save();

                $goal->current_amount -= $validated['amount'];

                if ($goal->is_completed && $goal->current_amount < $goal->target_amount) {
                    $goal->is_completed = false;
                    $goal->completed_at = null;
                }

                $goal->save();

                SavingsTransaction::create([
                    'user_id' => $user->id,
                    'savings_goal_id' => $goal->id,
                    'type' => 'withdraw',
                    'amount' => $validated['amount'],
                    'notes' => $validated['notes'] ?? null,
                    'balance_after' => $goal->current_amount,
                ]);
            });

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'withdraw_savings',
                'savings_goals',
                $goal->id,
                [
                    'safe_balance' => $oldSafeBalance,
                    'goal_current_amount' => $oldCurrentAmount,
                ],
                [
                    'safe_balance' => $user->fresh()->safe_balance,
                    'goal_current_amount' => $goal->fresh()->current_amount,
                ],
                $request
            );

            return response()->json([
                'message' => 'Withdrawal successful',
                'goal' => $goal->fresh(),
                'new_safe_balance' => $user->fresh()->safe_balance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to withdraw: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a savings goal
     */
    public function update(Request $request, SavingsGoal $goal)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'target_amount' => 'sometimes|numeric|min:0.01',
                'target_date' => 'nullable|date|after:today',
                'description' => 'nullable|string|max:1000',
            ]);

            $oldValues = $goal->toArray();
            $goal->update($validated);
            $newValues = $goal->fresh()->toArray();

            // Create audit log
            $this->createAuditLog(
                $request->user()->id,
                'update_savings_goal',
                'savings_goals',
                $goal->id,
                $oldValues,
                $newValues,
                $request
            );

            return response()->json([
                'message' => 'Goal updated successfully',
                'goal' => $goal->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update goal: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Archive a savings goal
     */
    public function archive(SavingsGoal $goal)
    {
        try {
            $user = auth()->user();
            $oldValues = $goal->toArray();

            $goal->is_archived = true;
            $goal->save();

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'archive_savings_goal',
                'savings_goals',
                $goal->id,
                $oldValues,
                $goal->fresh()->toArray(),
                request()
            );

            return response()->json([
                'message' => 'Goal archived successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to archive goal: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore an archived savings goal
     */
    public function restore($id)
    {
        try {
            $goal = SavingsGoal::withTrashed()->find($id);
            $user = auth()->user();
            
            if (!$goal) {
                return response()->json(['message' => 'Goal not found'], 404);
            }

            $oldValues = $goal->toArray();

            $goal->is_archived = false;
            $goal->save();

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'restore_savings_goal',
                'savings_goals',
                $goal->id,
                $oldValues,
                $goal->fresh()->toArray(),
                request()
            );

            return response()->json([
                'message' => 'Goal restored successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to restore goal: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a savings goal (soft delete)
     */
    public function destroy(SavingsGoal $goal)
    {
        try {
            $user = auth()->user();
            $oldValues = $goal->toArray();

            $goal->delete();

            // Create audit log
            $this->createAuditLog(
                $user->id,
                'delete_savings_goal',
                'savings_goals',
                $goal->id,
                $oldValues,
                ['deleted' => true],
                request()
            );

            return response()->json([
                'message' => 'Goal deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete goal: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transaction history
     */
    public function transactions(Request $request)
    {
        try {
            $user = $request->user();

            $query = SavingsTransaction::where('user_id', $user->id)
                ->with('savingsGoal');

            if ($request->filled('search')) {
                $search = $request->search;
                $query->whereHas('savingsGoal', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                });
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('date_range')) {
                $this->applyDateFilter($query, $request->date_range);
            }

            $transactions = $query->latest()->paginate($request->input('per_page', 15));

            return response()->json($transactions);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch transactions: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
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
        }
    }

    /**
     * Helper method to create audit log entries
     * Records all savings goal actions
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
            \Log::error('Failed to create audit log: ' . $e->getMessage());
        }
    }
}