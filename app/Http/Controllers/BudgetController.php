<?php

namespace App\Http\Controllers;

use App\Models\Pocket;
use App\Models\Allocation;
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
            
            $totalAllocated = $pockets->sum('allocated');
            $totalSpent = $pockets->sum('spent');
            $totalRemaining = $totalAllocated - $totalSpent;
            $health = $totalAllocated > 0 ? ($totalRemaining / $totalAllocated) * 100 : 100;

            // Get recent activity
            $recentActivity = Allocation::where('user_id', $user->id)
                ->with('pocket')
                ->latest()
                ->limit(10)
                ->get();

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
     * Allocate funds from safe balance to a pocket
     * Also logs the allocation in audit log
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

            $oldSafeBalance = $user->safe_balance;
            $oldPocketAllocated = $pocket->allocated;
            $oldPocketBalance = $pocket->balance;

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

            // Create audit log for allocation
            $this->createAuditLog(
                $user->id,
                'allocate_funds',
                'pockets',
                $pocket->id,
                [
                    'safe_balance' => $oldSafeBalance,
                    'pocket_allocated' => $oldPocketAllocated,
                    'pocket_balance' => $oldPocketBalance,
                ],
                [
                    'safe_balance' => $user->fresh()->safe_balance,
                    'pocket_allocated' => $pocket->fresh()->allocated,
                    'pocket_balance' => $pocket->fresh()->balance,
                ],
                $request
            );

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
     * Also logs the transfer in audit log
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

            $oldFromPocketBalance = $fromPocket->balance;
            $oldFromPocketSpent = $fromPocket->spent;
            $oldToPocketBalance = $toPocket->balance;
            $oldToPocketAllocated = $toPocket->allocated;

            DB::transaction(function () use ($fromPocket, $toPocket, $validated, $user) {
                $fromPocket->balance -= $validated['amount'];
                $fromPocket->spent += $validated['amount'];
                $fromPocket->save();

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

            // Create audit log for transfer
            $this->createAuditLog(
                $user->id,
                'transfer_funds',
                'pockets',
                $fromPocket->id,
                [
                    'from_pocket_balance' => $oldFromPocketBalance,
                    'from_pocket_spent' => $oldFromPocketSpent,
                    'to_pocket_balance' => $oldToPocketBalance,
                    'to_pocket_allocated' => $oldToPocketAllocated,
                ],
                [
                    'from_pocket_balance' => $fromPocket->fresh()->balance,
                    'from_pocket_spent' => $fromPocket->fresh()->spent,
                    'to_pocket_balance' => $toPocket->fresh()->balance,
                    'to_pocket_allocated' => $toPocket->fresh()->allocated,
                ],
                $request
            );

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

        return [
            'total_allocated' => $totalAllocated,
            'total_spent' => $totalSpent,
            'total_remaining' => $totalRemaining,
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

        return $insights;
    }

    /**
     * Helper method to create audit log entries
     * Records all budget-related actions
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