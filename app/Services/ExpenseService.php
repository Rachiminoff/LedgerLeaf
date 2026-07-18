<?php
namespace App\Services;

use App\Models\Expense;
use App\Models\Pocket;
use App\Models\User;
use App\Models\ExpenseAuditLog;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    /**
     * Create a new expense.
     */
    public function createExpense(User $user, array $data): Expense
    {
        return DB::transaction(function () use ($user, $data) {
            // Create expense
            $expense = $user->expenses()->create([
                'category_id' => $data['category_id'] ?? null,
                'pocket_id' => $data['pocket_id'] ?? null,
                'amount' => $data['amount'],
                'description' => $data['description'],
                'merchant' => $data['merchant'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'expense_date' => $data['expense_date'],
                'receipt_url' => $data['receipt_url'] ?? null,
                'tags' => $data['tags'] ?? null,
                'notes' => $data['notes'] ?? null,
                'is_archived' => false,
            ]);

            // Deduct from pocket if pocket_id is provided
            if ($data['pocket_id'] ?? false) {
                $pocket = Pocket::find($data['pocket_id']);
                if ($pocket && $pocket->user_id === $user->id) {
                    $pocket->deductBalance($data['amount']);
                }
            }

            // Update user balances
            $user->updateBalances();

            // Create audit log
            $this->logAction($expense, 'created', null, $expense->toArray(), $user);

            return $expense;
        });
    }

    /**
     * Update an existing expense.
     */
    public function updateExpense(Expense $expense, array $data): Expense
    {
        return DB::transaction(function () use ($expense, $data) {
            $oldValues = $expense->toArray();
            $oldPocketId = $expense->pocket_id;
            $oldAmount = $expense->amount;

            // Update expense
            $expense->update($data);

            // Handle pocket balance changes
            $newPocketId = $data['pocket_id'] ?? null;
            $newAmount = $data['amount'] ?? $expense->amount;

            // If pocket changed or amount changed
            if ($oldPocketId !== $newPocketId || $oldAmount !== $newAmount) {
                // Reverse old pocket deduction
                if ($oldPocketId) {
                    $oldPocket = Pocket::find($oldPocketId);
                    if ($oldPocket) {
                        $oldPocket->addBalance($oldAmount);
                    }
                }

                // Apply new pocket deduction
                if ($newPocketId) {
                    $newPocket = Pocket::find($newPocketId);
                    if ($newPocket) {
                        $newPocket->deductBalance($newAmount);
                    }
                }
            }

            // Update user balances
            $expense->user->updateBalances();

            // Create audit log
            $this->logAction($expense, 'updated', $oldValues, $expense->toArray(), $expense->user);

            return $expense;
        });
    }

    /**
     * Delete an expense (soft delete).
     */
    public function deleteExpense(Expense $expense): void
    {
        DB::transaction(function () use ($expense) {
            $oldValues = $expense->toArray();

            // Reverse pocket deduction
            if ($expense->pocket_id) {
                $pocket = Pocket::find($expense->pocket_id);
                if ($pocket) {
                    $pocket->addBalance($expense->amount);
                }
            }

            // Soft delete
            $expense->delete();

            // Update user balances
            $expense->user->updateBalances();

            // Create audit log
            $this->logAction($expense, 'deleted', $oldValues, null, $expense->user);
        });
    }

    /**
     * Archive an expense.
     */
    public function archiveExpense(Expense $expense): void
    {
        DB::transaction(function () use ($expense) {
            $oldValues = $expense->toArray();

            $expense->is_archived = true;
            $expense->save();

            // Reverse pocket deduction
            if ($expense->pocket_id) {
                $pocket = Pocket::find($expense->pocket_id);
                if ($pocket) {
                    $pocket->addBalance($expense->amount);
                }
            }

            // Update user balances
            $expense->user->updateBalances();

            // Create audit log
            $this->logAction($expense, 'archived', $oldValues, $expense->toArray(), $expense->user);
        });
    }

    /**
     * Restore an archived expense.
     */
    public function restoreExpense(Expense $expense): void
    {
        DB::transaction(function () use ($expense) {
            $oldValues = $expense->toArray();

            $expense->is_archived = false;
            $expense->save();

            // Re-apply pocket deduction
            if ($expense->pocket_id) {
                $pocket = Pocket::find($expense->pocket_id);
                if ($pocket) {
                    $pocket->deductBalance($expense->amount);
                }
            }

            // Update user balances
            $expense->user->updateBalances();

            // Create audit log
            $this->logAction($expense, 'restored', $oldValues, $expense->toArray(), $expense->user);
        });
    }

    /**
     * Log audit trail.
     */
    protected function logAction(Expense $expense, string $action, $oldValues, $newValues, User $user): void
    {
        ExpenseAuditLog::create([
            'expense_id' => $expense->id,
            'user_id' => $user->id,
            'action' => $action,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'previous_balance' => $user->safe_balance ?? 0,
            'updated_balance' => $user->safe_balance ?? 0,
            'ip_address' => request()->ip(),
        ]);
    }

    /**
     * Filter expenses.
     */
    public function filterExpenses($query, array $filters): void
    {
        if (isset($filters['date_range'])) {
            $this->applyDateFilter($query, $filters['date_range'], $filters['start_date'] ?? null, $filters['end_date'] ?? null);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['pocket_id'])) {
            $query->where('pocket_id', $filters['pocket_id']);
        }

        if (isset($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (isset($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['min_amount'])) {
            $query->where('amount', '>=', $filters['min_amount']);
        }

        if (isset($filters['max_amount'])) {
            $query->where('amount', '<=', $filters['max_amount']);
        }

        if (isset($filters['is_archived'])) {
            $filters['is_archived'] ? $query->archived() : $query->notArchived();
        }
    }

    protected function applyDateFilter($query, string $range, $startDate = null, $endDate = null): void
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
            case 'custom':
                if ($startDate && $endDate) {
                    $query->dateBetween($startDate, $endDate);
                }
                break;
        }
    }
}