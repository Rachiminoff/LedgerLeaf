<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'safe_balance',
        'total_balance',
        'currency',
        'timezone',
        'theme_preference',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'safe_balance' => 'decimal:2',
            'total_balance' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = [
        'formatted_total_balance',
        'formatted_safe_balance',
        'total_expenses',
        'total_income',
        'net_balance',
        'formatted_net_balance',
        'total_allocated_to_pockets',
        'total_spent_from_pockets',
        'total_remaining_in_pockets',
        'initials',
        'display_name',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * Get all transactions for the user.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get all expenses for the user.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Get all categories for the user.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Get all pockets for the user.
     */
    public function pockets(): HasMany
    {
        return $this->hasMany(Pocket::class);
    }

    /**
     * Get all allocations for the user.
     */
    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    /**
     * Get all budgets for the user.
     */
    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    /**
     * Get all savings goals for the user.
     */
    public function savingsGoals(): HasMany
    {
        return $this->hasMany(SavingsGoal::class);
    }

    /**
     * Get all notifications for the user.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get all audit logs for the user.
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Get the user's balance record.
     */
    public function balance(): HasOne
    {
        return $this->hasOne(UserBalance::class);
    }

    /**
     * Get all income sources for the user.
     */
    public function incomeSources(): HasMany
    {
        return $this->hasMany(IncomeSource::class);
    }

    /**
     * Get all bill reminders for the user.
     */
    public function billReminders(): HasMany
    {
        return $this->hasMany(BillReminder::class);
    }

    // ─── Accessors ──────────────────────────────────────────────────

    /**
     * Get formatted total balance.
     */
    public function getFormattedTotalBalanceAttribute(): string
    {
        return number_format($this->total_balance ?? 0, 2);
    }

    /**
     * Get formatted safe balance.
     */
    public function getFormattedSafeBalanceAttribute(): string
    {
        return number_format($this->safe_balance ?? 0, 2);
    }

    /**
     * Get total expenses.
     */
    public function getTotalExpensesAttribute(): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->sum('amount');
    }

    /**
     * Get total income from transactions.
     */
    public function getTotalIncomeAttribute(): float
    {
        return $this->transactions()
            ->where('type', 'income')
            ->where('is_archived', false)
            ->sum('amount');
    }

    /**
     * Get net balance (income - expenses).
     */
    public function getNetBalanceAttribute(): float
    {
        return $this->total_income - $this->total_expenses;
    }

    /**
     * Get formatted net balance.
     */
    public function getFormattedNetBalanceAttribute(): string
    {
        return number_format($this->net_balance, 2);
    }

    /**
     * Get total allocated to pockets.
     */
    public function getTotalAllocatedToPocketsAttribute(): float
    {
        return $this->pockets()->sum('allocated');
    }

    /**
     * Get total spent from pockets.
     */
    public function getTotalSpentFromPocketsAttribute(): float
    {
        return $this->pockets()->sum('spent');
    }

    /**
     * Get total remaining in pockets.
     */
    public function getTotalRemainingInPocketsAttribute(): float
    {
        return $this->total_allocated_to_pockets - $this->total_spent_from_pockets;
    }

    /**
     * Get the user's initials.
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach ($words as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        return $initials;
    }

    /**
     * Get the user's display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name ?? $this->email;
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Check if user has sufficient balance.
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return ($this->safe_balance ?? 0) >= $amount;
    }

    /**
     * Update user balances.
     */
    public function updateBalances(): void
    {
        $totalIncome = $this->transactions()
            ->where('type', 'income')
            ->where('is_archived', false)
            ->sum('amount');

        $totalExpenses = $this->expenses()
            ->where('is_archived', false)
            ->sum('amount');

        $this->total_balance = $totalIncome;
        $this->safe_balance = $totalIncome - $totalExpenses;
        $this->save();
    }

    /**
     * Get budget summary.
     */
    public function getBudgetSummary(): array
    {
        $pockets = $this->pockets()->whereNull('deleted_at')->get();
        
        $totalAllocated = $pockets->sum('allocated');
        $totalSpent = $pockets->sum('spent');
        $totalRemaining = $totalAllocated - $totalSpent;

        // Calculate budget health
        $health = $totalAllocated > 0 ? ($totalRemaining / $totalAllocated) * 100 : 0;

        return [
            'safe_balance' => $this->safe_balance ?? 0,
            'allocated_balance' => $totalAllocated,
            'remaining_balance' => $totalRemaining,
            'monthly_budget' => $totalAllocated,
            'total_pockets' => $pockets->count(),
            'budget_health' => min(max($health, 0), 100),
            'budget_health_label' => $this->getHealthLabel($health),
        ];
    }

    /**
     * Get budget health label.
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
     * Get budget insights.
     */
    public function getBudgetInsights(): array
    {
        $insights = [];
        $pockets = $this->pockets()->whereNull('deleted_at')->get();

        // Find pockets near limit
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

        // Find over budget
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

        // Check if user has enough safe balance
        if (($this->safe_balance ?? 0) > 1000) {
            $insights[] = [
                'id' => 'safe_balance_positive',
                'type' => 'positive',
                'title' => 'You have unallocated funds',
                'description' => "Your safe balance of ₱" . number_format($this->safe_balance, 2) . " is ready to allocate.",
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

        return $insights;
    }

    /**
     * Get monthly spending breakdown.
     */
    public function getMonthlySpending(int $year = null, int $month = null): array
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;

        $expenses = $this->expenses()
            ->whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->where('is_archived', false)
            ->get();

        $total = $expenses->sum('amount');
        $categories = $expenses->groupBy('category_id')->map(function ($items) {
            return [
                'category' => $items->first()->category?->name ?? 'Uncategorized',
                'total' => $items->sum('amount'),
                'count' => $items->count(),
            ];
        });

        return [
            'total' => $total,
            'categories' => $categories,
            'transaction_count' => $expenses->count(),
        ];
    }

    /**
     * Get spending insights.
     */
    public function getSpendingInsights(): array
    {
        $insights = [];
        $currentMonth = $this->getMonthlySpending();
        $lastMonth = $this->getMonthlySpending(
            now()->subMonth()->year,
            now()->subMonth()->month
        );

        // Compare month-over-month
        if ($lastMonth['total'] > 0) {
            $change = (($currentMonth['total'] - $lastMonth['total']) / $lastMonth['total']) * 100;
            $insights[] = [
                'type' => $change < 0 ? 'positive' : 'warning',
                'message' => $change < 0
                    ? "You spent " . abs(round($change, 1)) . "% less this month than last month."
                    : "Your spending increased by " . round($change, 1) . "% this month.",
            ];
        }

        // Top category
        if (!empty($currentMonth['categories'])) {
            $topCategory = collect($currentMonth['categories'])->sortByDesc('total')->first();
            if ($topCategory) {
                $percentage = ($topCategory['total'] / $currentMonth['total']) * 100;
                $insights[] = [
                    'type' => 'neutral',
                    'message' => "Your largest spending category is {$topCategory['category']} at " .
                        round($percentage, 1) . "% of your total spending.",
                ];
            }
        }

        return $insights;
    }

    /**
     * Get recommended budget for a category.
     */
    public function getRecommendedBudget(int $categoryId): float
    {
        $average = $this->expenses()
            ->where('category_id', $categoryId)
            ->where('is_archived', false)
            ->whereMonth('expense_date', '>=', now()->subMonths(3))
            ->avg('amount');

        return $average ?? 0;
    }

    /**
     * Check if user is on track with budget.
     */
    public function isOnTrackWithBudget(int $pocketId): bool
    {
        $pocket = $this->pockets()->find($pocketId);
        if (!$pocket) {
            return true;
        }

        $daysInMonth = now()->daysInMonth;
        $dayOfMonth = now()->day;
        $expectedSpent = ($pocket->allocated / $daysInMonth) * $dayOfMonth;

        return $pocket->spent <= $expectedSpent;
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    /**
     * Scope users by name or email search.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }

    /**
     * Scope users with active subscriptions.
     */
    public function scopeWithActiveSubscriptions($query)
    {
        return $query->whereHas('subscriptions', function ($q) {
            $q->where('ends_at', '>', now())->orWhereNull('ends_at');
        });
    }

    /**
     * Scope users by role.
     */
    public function scopeByRole($query, string $role)
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }

    // ─── Boot Methods ──────────────────────────────────────────────

    protected static function booted(): void
    {
        static::created(function (User $user) {
            // Create default pockets for new user
            $defaultPockets = [
                ['name' => 'Rent', 'icon' => 'mdi:home', 'color' => '#EF4444'],
                ['name' => 'Groceries', 'icon' => 'mdi:cart', 'color' => '#10B981'],
                ['name' => 'Utilities', 'icon' => 'mdi:lightbulb', 'color' => '#F59E0B'],
                ['name' => 'Transportation', 'icon' => 'mdi:car', 'color' => '#3B82F6'],
                ['name' => 'Entertainment', 'icon' => 'mdi:gamepad', 'color' => '#8B5CF6'],
                ['name' => 'Savings', 'icon' => 'mdi:bank', 'color' => '#06B6D4'],
            ];

            foreach ($defaultPockets as $index => $pocketData) {
                $user->pockets()->create([
                    'name' => $pocketData['name'],
                    'icon' => $pocketData['icon'],
                    'color' => $pocketData['color'],
                    'is_default' => true,
                    'order' => $index,
                    'allocated' => 0,
                    'balance' => 0,
                    'spent' => 0,
                ]);
            }

            // Create default categories
            $defaultCategories = [
                ['name' => 'Food & Dining', 'icon' => 'mdi:food', 'color' => '#10B981', 'type' => 'expense'],
                ['name' => 'Shopping', 'icon' => 'mdi:shopping', 'color' => '#8B5CF6', 'type' => 'expense'],
                ['name' => 'Transport', 'icon' => 'mdi:car', 'color' => '#3B82F6', 'type' => 'expense'],
                ['name' => 'Bills & Utilities', 'icon' => 'mdi:file-document', 'color' => '#F59E0B', 'type' => 'expense'],
                ['name' => 'Healthcare', 'icon' => 'mdi:heart-pulse', 'color' => '#EC4899', 'type' => 'expense'],
                ['name' => 'Education', 'icon' => 'mdi:school', 'color' => '#06B6D4', 'type' => 'expense'],
                ['name' => 'Salary', 'icon' => 'mdi:cash', 'color' => '#10B981', 'type' => 'income'],
                ['name' => 'Freelance', 'icon' => 'mdi:laptop', 'color' => '#8B5CF6', 'type' => 'income'],
            ];

            foreach ($defaultCategories as $categoryData) {
                $user->categories()->create([
                    'name' => $categoryData['name'],
                    'icon' => $categoryData['icon'],
                    'color' => $categoryData['color'],
                    'type' => $categoryData['type'],
                    'is_default' => true,
                ]);
            }

            // Create user balance record
            $user->balance()->create([
                'total_balance' => 0,
                'safe_balance' => 0,
                'pending_balance' => 0,
            ]);
        });

        static::deleting(function (User $user) {
            // Soft delete all related records
            $user->pockets()->delete();
            $user->categories()->delete();
            $user->expenses()->delete();
            $user->transactions()->delete();
            $user->budgets()->delete();
            $user->savingsGoals()->delete();
            $user->allocations()->delete();
        });
    }
}