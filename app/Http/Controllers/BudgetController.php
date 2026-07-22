<?php

namespace App\Http\Controllers;

use App\Models\Pocket;
use App\Models\Allocation;
use App\Models\Expense;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    /**
     * Get all budget data for the dashboard
     * Includes summary, stats, insights, and recent activity
     */
    public function getData(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Get safe balance directly from user
            $safeBalance = $user->safe_balance ?? 0;
            
            $pockets = Pocket::where('user_id', $user->id)->whereNull('deleted_at')->get();
            
            // Calculate pocket totals
            $totalAllocated = $pockets->sum('allocated');
            $totalSpent = $pockets->sum('spent');
            $totalRemaining = $totalAllocated - $totalSpent;
            $health = $totalAllocated > 0 ? ($totalRemaining / $totalAllocated) * 100 : 100;

            // Get recent activity (allocations and expenses)
            $recentActivity = $this->getRecentActivity($user);

            // Get insights
            $insights = $this->getInsights($user, $pockets);

            return response()->json([
                'summary' => [
                    'safe_balance' => $safeBalance,
                    'allocated_balance' => $totalAllocated,
                    'remaining_balance' => $totalRemaining,
                    'monthly_budget' => $totalAllocated,
                    'total_pockets' => $pockets->count(),
                    'budget_health' => min(max($health, 0), 100),
                    'budget_health_label' => $this->getHealthLabel($health),
                ],
                'stats' => $this->getBudgetStats($user, $pockets),
                'insights' => $insights,
                'recent_activity' => $recentActivity,
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Get recent activity including both allocations and expenses
     */
    private function getRecentActivity($user)
    {
        // Get recent allocations
        $allocations = Allocation::where('user_id', $user->id)
            ->with('pocket')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'allocation',
                    'description' => $item->description ?? 'Funds allocated',
                    'amount' => $item->amount,
                    'pocket_name' => $item->pocket?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        // Get recent expenses
        $expenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->with('pocket')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'expense',
                    'description' => $item->description,
                    'amount' => $item->amount,
                    'pocket_name' => $item->pocket?->name ?? 'Unknown',
                    'created_at' => $item->created_at,
                ];
            });

        // Merge and sort by created_at
        $activities = $allocations->concat($expenses)
            ->sortByDesc('created_at')
            ->values()
            ->take(10);

        return $activities;
    }

    /**
     * Create a new pocket.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:500',
                'icon' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:20',
                'allocated' => 'nullable|numeric|min:0',
            ]);

            $user = $request->user();

            // Check if user has enough safe balance
            $allocatedAmount = $validated['allocated'] ?? 0;
            if ($allocatedAmount > 0 && ($user->safe_balance ?? 0) < $allocatedAmount) {
                return response()->json([
                    'message' => 'Insufficient safe balance',
                    'available' => $user->safe_balance,
                    'requested' => $allocatedAmount
                ], 400);
            }

            DB::transaction(function () use ($user, $validated, $allocatedAmount) {
                // Create the pocket
                $pocket = Pocket::create([
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                    'icon' => $validated['icon'] ?? 'mdi:folder',
                    'color' => $validated['color'] ?? '#5CB85C',
                    'allocated' => $allocatedAmount,
                    'balance' => $allocatedAmount,
                    'spent' => 0,
                    'is_archived' => false,
                ]);

                // If there's an allocation, deduct from safe balance
                if ($allocatedAmount > 0) {
                    $user->safe_balance -= $allocatedAmount;
                    $user->save();

                    // Create allocation record
                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $allocatedAmount,
                        'type' => 'allocate',
                        'description' => "Allocated ₱" . number_format($allocatedAmount, 2) . " to {$pocket->name}",
                    ]);
                }
            });

            return response()->json([
                'message' => 'Pocket created successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Update a pocket.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:500',
                'icon' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:20',
                'allocated' => 'nullable|numeric|min:0',
            ]);

            $user = $request->user();
            $pocket = Pocket::where('user_id', $user->id)->where('id', $id)->first();

            if (!$pocket) {
                return response()->json(['message' => 'Pocket not found'], 404);
            }

            $newAllocatedAmount = $validated['allocated'] ?? $pocket->allocated;
            $oldAllocatedAmount = $pocket->allocated;
            $difference = $newAllocatedAmount - $oldAllocatedAmount;

            DB::transaction(function () use ($user, $pocket, $validated, $newAllocatedAmount, $difference) {
                // Update pocket details
                $pocket->name = $validated['name'];
                $pocket->description = $validated['description'] ?? $pocket->description;
                $pocket->icon = $validated['icon'] ?? $pocket->icon;
                $pocket->color = $validated['color'] ?? $pocket->color;
                $pocket->allocated = $newAllocatedAmount;

                // Adjust balance if allocation changed
                if ($difference != 0) {
                    $pocket->balance += $difference;
                    
                    // Adjust safe balance
                    if ($difference > 0) {
                        // Increasing allocation - deduct from safe balance
                        if (($user->safe_balance ?? 0) < $difference) {
                            throw new \Exception('Insufficient safe balance');
                        }
                        $user->safe_balance -= $difference;
                    } else {
                        // Decreasing allocation - refund to safe balance
                        $user->safe_balance += abs($difference);
                    }
                    $user->save();

                    // Create allocation record for the change
                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => abs($difference),
                        'type' => $difference > 0 ? 'allocate' : 'refund',
                        'description' => ($difference > 0 ? 'Increased' : 'Decreased') . " allocation by ₱" . number_format(abs($difference), 2),
                    ]);
                }

                $pocket->save();
            });

            return response()->json([
                'message' => 'Pocket updated successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Allocate funds from safe balance to a pocket
     */
    public function allocate(Request $request)
    {
        try {
            $validated = $request->validate([
                'pocket_id' => 'required|exists:pockets,id',
                'amount' => 'required|numeric|min:0.01',
            ]);

            $user = $request->user();
            $pocket = Pocket::find($validated['pocket_id']);

            if ($pocket->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if ($user->safe_balance < $validated['amount']) {
                return response()->json([
                    'message' => 'Insufficient safe balance',
                    'available' => $user->safe_balance,
                    'requested' => $validated['amount']
                ], 400);
            }

            DB::transaction(function () use ($user, $pocket, $validated) {
                $user->safe_balance -= $validated['amount'];
                $user->save();

                $pocket->allocated += $validated['amount'];
                $pocket->balance += $validated['amount'];
                $pocket->save();

                Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $pocket->id,
                    'amount' => $validated['amount'],
                    'type' => 'allocate',
                    'description' => "Allocated ₱" . number_format($validated['amount'], 2) . " to {$pocket->name}",
                ]);
            });

            return response()->json([
                'message' => 'Funds allocated successfully',
                'new_safe_balance' => $user->fresh()->safe_balance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Transfer funds between pockets
     */
    public function transfer(Request $request)
    {
        try {
            $validated = $request->validate([
                'from_pocket_id' => 'required|exists:pockets,id',
                'to_pocket_id' => 'required|exists:pockets,id|different:from_pocket_id',
                'amount' => 'required|numeric|min:0.01',
            ]);

            $user = $request->user();
            $fromPocket = Pocket::find($validated['from_pocket_id']);
            $toPocket = Pocket::find($validated['to_pocket_id']);

            if ($fromPocket->user_id !== $user->id || $toPocket->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if ($fromPocket->balance < $validated['amount']) {
                return response()->json([
                    'message' => 'Insufficient balance in source pocket',
                    'available' => $fromPocket->balance,
                    'requested' => $validated['amount']
                ], 400);
            }

            DB::transaction(function () use ($fromPocket, $toPocket, $validated, $user) {
                // Deduct from source pocket
                $fromPocket->balance -= $validated['amount'];
                // Note: We don't change spent here because transfer is not an expense
                $fromPocket->save();

                // Add to destination pocket
                $toPocket->balance += $validated['amount'];
                $toPocket->allocated += $validated['amount'];
                $toPocket->save();

                Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $fromPocket->id,
                    'amount' => $validated['amount'],
                    'type' => 'transfer_out',
                    'to_pocket_id' => $toPocket->id,
                    'description' => "Transferred ₱" . number_format($validated['amount'], 2) . " from {$fromPocket->name} to {$toPocket->name}",
                ]);

                Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $toPocket->id,
                    'amount' => $validated['amount'],
                    'type' => 'transfer_in',
                    'from_pocket_id' => $fromPocket->id,
                    'description' => "Received ₱" . number_format($validated['amount'], 2) . " from {$fromPocket->name}",
                ]);
            });

            return response()->json([
                'message' => 'Transfer completed successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Archive a pocket - SYNCED WITH EXPENSES
     */
    public function archive(Request $request, $id)
    {
        try {
            $user = $request->user();
            $pocket = Pocket::where('user_id', $user->id)->where('id', $id)->first();

            if (!$pocket) {
                return response()->json(['message' => 'Pocket not found'], 404);
            }

            DB::transaction(function () use ($user, $pocket) {
                // Archive all expenses in this pocket
                Expense::where('user_id', $user->id)
                    ->where('pocket_id', $pocket->id)
                    ->where('is_archived', false)
                    ->update(['is_archived' => true]);

                // Refund remaining balance to safe balance
                $refundAmount = $pocket->allocated - $pocket->spent;
                if ($refundAmount > 0) {
                    $user->safe_balance += $refundAmount;
                    $user->save();

                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $refundAmount,
                        'type' => 'refund',
                        'description' => "Refunded ₱" . number_format($refundAmount, 2) . " from {$pocket->name}",
                    ]);
                }

                $pocket->is_archived = true;
                $pocket->deleted_at = now();
                $pocket->save();
            });

            return response()->json([
                'message' => 'Pocket archived successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Delete a pocket permanently - SYNCED WITH EXPENSES
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $pocket = Pocket::where('user_id', $user->id)->where('id', $id)->first();

            if (!$pocket) {
                return response()->json(['message' => 'Pocket not found'], 404);
            }

            DB::transaction(function () use ($user, $pocket) {
                // Permanently delete all expenses in this pocket
                Expense::where('user_id', $user->id)
                    ->where('pocket_id', $pocket->id)
                    ->forceDelete();

                // Refund remaining balance to safe balance
                $refundAmount = $pocket->allocated - $pocket->spent;
                if ($refundAmount > 0) {
                    $user->safe_balance += $refundAmount;
                    $user->save();

                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $refundAmount,
                        'type' => 'refund',
                        'description' => "Refunded ₱" . number_format($refundAmount, 2) . " from {$pocket->name}",
                    ]);
                }

                // Delete the pocket permanently
                $pocket->forceDelete();
            });

            return response()->json([
                'message' => 'Pocket deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Get budget statistics
     */
    private function getBudgetStats($user, $pockets = null)
    {
        if ($pockets === null) {
            $pockets = Pocket::where('user_id', $user->id)->whereNull('deleted_at')->get();
        }
        
        $totalAllocated = $pockets->sum('allocated');
        $totalSpent = $pockets->sum('spent');
        $totalRemaining = $totalAllocated - $totalSpent;
        
        $overBudget = $pockets->filter(function ($p) {
            return $p->spent > $p->allocated;
        })->count();
        
        $underBudget = $pockets->filter(function ($p) {
            return $p->spent < $p->allocated;
        })->count();

        // Get total expenses for the user
        $totalExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->sum('amount');

        return [
            'total_allocated' => $totalAllocated,
            'total_spent' => $totalSpent,
            'total_remaining' => $totalRemaining,
            'total_expenses' => $totalExpenses,
            'average_progress' => $totalAllocated > 0 ? ($totalSpent / $totalAllocated) * 100 : 0,
            'over_budget_count' => $overBudget,
            'under_budget_count' => $underBudget,
        ];
    }

    /**
     * Get health label based on budget health score
     */
    private function getHealthLabel(float $health): string
    {
        if ($health >= 90) return 'Excellent';
        if ($health >= 70) return 'Good';
        if ($health >= 50) return 'Fair';
        if ($health >= 30) return 'Needs Attention';
        return 'Critical';
    }

    /**
     * Generate insights based on user's budget data
     */
    private function getInsights($user, $pockets): array
    {
        $insights = [];

        // Safe balance insights
        if (($user->safe_balance ?? 0) > 1000) {
            $insights[] = [
                'id' => 'safe_balance_positive',
                'type' => 'positive',
                'title' => 'You have unallocated funds',
                'description' => "Your safe balance of ₱" . number_format($user->safe_balance, 2) . " is ready to allocate.",
            ];
        }

        // Check pockets near limit
        $nearLimit = $pockets->filter(function ($p) {
            return $p->allocated > 0 && ($p->spent / $p->allocated) >= 0.8 && ($p->spent / $p->allocated) < 1;
        });

        foreach ($nearLimit as $pocket) {
            $insights[] = [
                'id' => 'near_limit_' . $pocket->id,
                'type' => 'warning',
                'title' => "{$pocket->name} is near its limit",
                'description' => "Used " . round(($pocket->spent / $pocket->allocated) * 100) . "% of its budget.",
            ];
        }

        // Check over budget
        $overBudget = $pockets->filter(function ($p) {
            return $p->spent > $p->allocated;
        });

        foreach ($overBudget as $pocket) {
            $insights[] = [
                'id' => 'over_budget_' . $pocket->id,
                'type' => 'critical',
                'title' => "{$pocket->name} is over budget",
                'description' => "Exceeded by ₱" . number_format($pocket->spent - $pocket->allocated, 2),
            ];
        }

        // Check for empty pockets
        $emptyPockets = $pockets->filter(function ($p) {
            return $p->allocated == 0;
        });

        if ($emptyPockets->count() > 0) {
            $insights[] = [
                'id' => 'empty_pockets',
                'type' => 'neutral',
                'title' => 'Some pockets have no budget',
                'description' => $emptyPockets->count() . " pocket(s) have no allocated budget.",
            ];
        }

        // If no pockets
        if ($pockets->count() === 0) {
            $insights[] = [
                'id' => 'no_pockets',
                'type' => 'neutral',
                'title' => 'No pockets yet',
                'description' => 'Create your first pocket to start budgeting.',
            ];
        }

        // Check total expenses vs allocated
        $totalExpenses = Expense::where('user_id', $user->id)
            ->where('is_archived', false)
            ->sum('amount');
        
        $totalAllocated = $pockets->sum('allocated');
        
        if ($totalAllocated > 0 && $totalExpenses > $totalAllocated) {
            $insights[] = [
                'id' => 'exceeded_budget',
                'type' => 'critical',
                'title' => 'You have exceeded your total budget',
                'description' => "Total expenses (₱" . number_format($totalExpenses, 2) . ") exceed total allocated (₱" . number_format($totalAllocated, 2) . ").",
            ];
        }

        return $insights;
    }

    /**
     * Helper method to create audit log entries
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