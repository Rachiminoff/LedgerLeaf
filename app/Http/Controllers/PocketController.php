<?php

namespace App\Http\Controllers;

use App\Models\Pocket;
use App\Models\Expense;
use App\Models\Allocation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PocketController extends Controller
{
    /**
     * List all pockets for the authenticated user (Web)
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $query = Pocket::where('user_id', $user->id);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            if ($request->status === 'archived') {
                $query->onlyTrashed();
            } else {
                $query->where('is_archived', false);
            }

            $sortBy = $request->sort_by ?? 'name';
            $sortOrder = $request->sort_order ?? 'asc';
            $query->orderBy($sortBy, $sortOrder);

            $pockets = $query->get();

            $pockets->each(function ($pocket) {
                $pocket->progress = $pocket->allocated > 0 
                    ? round(($pocket->spent / $pocket->allocated) * 100, 2)
                    : 0;
                $pocket->remaining = $pocket->allocated - $pocket->spent;
            });

            return response()->json($pockets);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * API endpoint for pockets
     * Returns JSON for use in filters and other components
     */
    public function apiIndex(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([], 401);
            }

            $pockets = Pocket::where('user_id', $user->id)
                ->where('is_archived', false)
                ->orderBy('name')
                ->get();

            // Format pockets for the frontend
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

            return response()->json($formattedPockets);
            
        } catch (\Exception $e) {
            \Log::error('Pocket API error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch pockets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new pocket
     * Also logs the creation in audit log
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'color' => 'nullable|string',
                'allocated' => 'nullable|numeric|min:0',
            ]);

            $user = $request->user();

            if (Pocket::where('user_id', $user->id)->where('name', $validated['name'])->exists()) {
                return response()->json(['message' => 'A pocket with this name already exists'], 422);
            }

            $pocket = DB::transaction(function () use ($user, $validated) {
                $pocket = Pocket::create([
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                    'icon' => $validated['icon'] ?? 'mdi:folder',
                    'color' => $validated['color'] ?? '#5CB85C',
                    'allocated' => $validated['allocated'] ?? 0,
                    'balance' => $validated['allocated'] ?? 0,
                    'spent' => 0,
                    'is_default' => false,
                ]);

                if ($validated['allocated'] > 0) {
                    $user->safe_balance -= $validated['allocated'];
                    $user->save();

                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $validated['allocated'],
                        'type' => 'allocate',
                        'description' => "Allocated ₱" . number_format($validated['allocated'], 2) . " to {$pocket->name}",
                    ]);
                }

                return $pocket;
            });

            // Create audit log for pocket creation
            $this->createAuditLog(
                $user->id,
                'create_pocket',
                'pockets',
                $pocket->id,
                null,
                $pocket->toArray(),
                $request
            );

            return response()->json(['message' => 'Pocket created successfully', 'pocket' => $pocket], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing pocket
     * Also logs the update in audit log
     */
    public function update(Request $request, Pocket $pocket)
    {
        try {
            if ($pocket->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'icon' => 'nullable|string|max:50',
                'color' => 'nullable|string',
            ]);

            $oldValues = $pocket->toArray();
            $pocket->update($validated);
            $newValues = $pocket->fresh()->toArray();

            // Create audit log for pocket update
            $this->createAuditLog(
                $request->user()->id,
                'update_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                $newValues,
                $request
            );

            return response()->json(['message' => 'Pocket updated successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Archive a pocket and refund remaining balance to safe balance
     * Also logs the archive action in audit log
     */
    public function archive(Pocket $pocket)
    {
        try {
            if ($pocket->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = auth()->user();
            $refundAmount = $pocket->allocated - $pocket->spent;
            $oldValues = $pocket->toArray();

            DB::transaction(function () use ($pocket, $refundAmount, $user) {
                // Refund remaining balance to safe balance
                if ($refundAmount > 0) {
                    $user->safe_balance += $refundAmount;
                    $user->save();

                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $refundAmount,
                        'type' => 'refund',
                        'description' => "Refunded ₱" . number_format($refundAmount, 2) . " from {$pocket->name} to safe balance",
                    ]);
                }

                // Soft delete the pocket
                $pocket->delete();
            });

            // Create audit log for archive action
            $this->createAuditLog(
                $user->id,
                'archive_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                ['is_archived' => true, 'refunded_amount' => $refundAmount],
                request()
            );

            return response()->json([
                'message' => 'Pocket archived successfully',
                'refunded' => $refundAmount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Restore an archived pocket
     * Also logs the restore action in audit log
     */
    public function restore($id)
    {
        try {
            $pocket = Pocket::withTrashed()->find($id);
            $user = auth()->user();
            
            if (!$pocket || $pocket->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $oldValues = $pocket->toArray();
            $pocket->restore();
            $newValues = $pocket->fresh()->toArray();

            // Create audit log for restore action
            $this->createAuditLog(
                $user->id,
                'restore_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                $newValues,
                request()
            );

            return response()->json(['message' => 'Pocket restored successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Permanently delete a pocket and refund remaining balance
     * Also logs the deletion in audit log
     */
    public function destroy(Pocket $pocket)
    {
        try {
            if ($pocket->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = auth()->user();
            $refundAmount = $pocket->allocated - $pocket->spent;
            $oldValues = $pocket->toArray();

            DB::transaction(function () use ($pocket, $refundAmount, $user) {
                // Refund remaining balance to safe balance
                if ($refundAmount > 0) {
                    $user->safe_balance += $refundAmount;
                    $user->save();

                    Allocation::create([
                        'user_id' => $user->id,
                        'pocket_id' => $pocket->id,
                        'amount' => $refundAmount,
                        'type' => 'refund',
                        'description' => "Refunded ₱" . number_format($refundAmount, 2) . " from {$pocket->name} to safe balance",
                    ]);
                }

                // Force delete the pocket
                $pocket->forceDelete();
            });

            // Create audit log for delete action
            $this->createAuditLog(
                $user->id,
                'delete_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                ['deleted' => true, 'refunded_amount' => $refundAmount],
                request()
            );

            return response()->json([
                'message' => 'Pocket deleted successfully',
                'refunded' => $refundAmount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Refund pocket balance back to safe balance (without deleting)
     * Also logs the refund in audit log
     */
    public function refund(Request $request)
    {
        try {
            $validated = $request->validate([
                'pocket_id' => 'required|exists:pockets,id',
            ]);

            $user = $request->user();
            $pocket = Pocket::find($validated['pocket_id']);

            if ($pocket->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $refundAmount = $pocket->allocated - $pocket->spent;

            if ($refundAmount <= 0) {
                return response()->json([
                    'message' => 'No balance to refund',
                    'amount' => 0
                ]);
            }

            $oldValues = $pocket->toArray();

            DB::transaction(function () use ($user, $pocket, $refundAmount) {
                // Add to safe balance
                $user->safe_balance += $refundAmount;
                $user->save();

                // Reset pocket balance
                $pocket->allocated -= $refundAmount;
                $pocket->balance -= $refundAmount;
                $pocket->save();

                // Create allocation record for refund
                Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $pocket->id,
                    'amount' => $refundAmount,
                    'type' => 'refund',
                    'description' => "Refunded ₱" . number_format($refundAmount, 2) . " from {$pocket->name} to safe balance",
                ]);
            });

            $newValues = $pocket->fresh()->toArray();

            // Create audit log for refund action
            $this->createAuditLog(
                $user->id,
                'refund_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                $newValues,
                $request
            );

            return response()->json([
                'message' => 'Funds refunded successfully',
                'amount' => $refundAmount,
                'new_safe_balance' => $user->safe_balance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Deduct amount from pocket (for expenses)
     * Also logs the deduction in audit log
     */
    public function deduct(Request $request)
    {
        try {
            $validated = $request->validate([
                'pocket_id' => 'required|exists:pockets,id',
                'amount' => 'required|numeric|min:0.01',
                'description' => 'required|string|max:255',
                'expense_date' => 'required|date',
                'payment_method' => 'nullable|string',
                'merchant' => 'nullable|string',
                'notes' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
            ]);

            $user = $request->user();
            $pocket = Pocket::find($validated['pocket_id']);

            if ($pocket->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $available = $pocket->allocated - $pocket->spent;
            if ($validated['amount'] > $available) {
                return response()->json([
                    'message' => 'Insufficient balance',
                    'available' => $available,
                    'requested' => $validated['amount']
                ], 400);
            }

            $oldValues = $pocket->toArray();

            $expense = DB::transaction(function () use ($pocket, $validated, $user) {
                // Update pocket
                $pocket->spent += $validated['amount'];
                $pocket->balance -= $validated['amount'];
                $pocket->save();

                // Create expense
                $expense = Expense::create([
                    'user_id' => $user->id,
                    'pocket_id' => $pocket->id,
                    'category_id' => $validated['category_id'] ?? null,
                    'amount' => $validated['amount'],
                    'description' => $validated['description'],
                    'expense_date' => $validated['expense_date'],
                    'payment_method' => $validated['payment_method'] ?? null,
                    'merchant' => $validated['merchant'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                    'type' => 'expense',
                    'is_archived' => false,
                ]);

                // Create allocation record
                Allocation::create([
                    'user_id' => $user->id,
                    'pocket_id' => $pocket->id,
                    'amount' => $validated['amount'],
                    'type' => 'spend',
                    'description' => "Spent ₱" . number_format($validated['amount'], 2) . " on {$validated['description']}",
                ]);

                return $expense;
            });

            $newValues = $pocket->fresh()->toArray();

            // Create audit log for deduction action
            $this->createAuditLog(
                $user->id,
                'deduct_pocket',
                'pockets',
                $pocket->id,
                $oldValues,
                $newValues,
                $request
            );

            return response()->json([
                'message' => 'Expense added successfully',
                'expense' => $expense,
                'remaining' => $pocket->allocated - $pocket->spent,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Helper method to create audit log entries
     * Records all actions performed on pockets
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