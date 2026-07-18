<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'icon',
        'color',
        'type',
        'is_default',
        'order',
        'description',
        'parent_id',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = [
        'total_spent',
        'monthly_spent',
        'weekly_spent',
        'transaction_count',
        'formatted_total_spent',
        'is_income',
        'is_expense',
        'is_savings',
        'display_name',
        'icon_component',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    /**
     * Get the user that owns the category.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all transactions for this category.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get all expenses for this category.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Get all budgets for this category.
     */
    public function budgets(): BelongsToMany
    {
        return $this->belongsToMany(Budget::class, 'budget_categories')
            ->withPivot('allocated', 'spent', 'remaining', 'month_year')
            ->withTimestamps();
    }

    /**
     * Get the current month's budget for this category.
     */
    public function currentBudget()
    {
        return $this->belongsToMany(Budget::class, 'budget_categories')
            ->withPivot('allocated', 'spent', 'remaining')
            ->wherePivot('month_year', now()->format('Y-m-01'))
            ->withTimestamps();
    }

    /**
     * Get parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get all savings goals for this category.
     */
    public function savingsGoals(): HasMany
    {
        return $this->hasMany(SavingsGoal::class);
    }

    // ─── Accessors ──────────────────────────────────────────────────

    /**
     * Get total spent across all time.
     */
    public function getTotalSpentAttribute(): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->sum('amount');
    }

    /**
     * Get monthly spent.
     */
    public function getMonthlySpentAttribute(): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year)
            ->sum('amount');
    }

    /**
     * Get weekly spent.
     */
    public function getWeeklySpentAttribute(): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->whereBetween('expense_date', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('amount');
    }

    /**
     * Get transaction count.
     */
    public function getTransactionCountAttribute(): int
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->count();
    }

    /**
     * Get formatted total spent.
     */
    public function getFormattedTotalSpentAttribute(): string
    {
        return number_format($this->total_spent, 2);
    }

    /**
     * Check if category is income type.
     */
    public function getIsIncomeAttribute(): bool
    {
        return $this->type === 'income';
    }

    /**
     * Check if category is expense type.
     */
    public function getIsExpenseAttribute(): bool
    {
        return $this->type === 'expense';
    }

    /**
     * Check if category is savings type.
     */
    public function getIsSavingsAttribute(): bool
    {
        return $this->type === 'savings';
    }

    /**
     * Get the category's display name with icon component.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name;
    }

    /**
     * Get the icon as a formatted component string for frontend.
     */
    public function getIconComponentAttribute(): string
    {
        if (!$this->icon) {
            return 'mdi:folder';
        }
        return $this->icon;
    }

    /**
     * Get the category's color with opacity.
     */
    public function getColorWithOpacityAttribute(): string
    {
        return $this->color . '20';
    }

    /**
     * Get the full icon data for frontend.
     */
    public function getIconDataAttribute(): array
    {
        return [
            'icon' => $this->icon_component,
            'color' => $this->color,
            'name' => $this->name,
        ];
    }

    // ─── Helper Methods ────────────────────────────────────────────

    /**
     * Get spending for a specific month.
     */
    public function getSpentForMonth(int $month, int $year): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->sum('amount');
    }

    /**
     * Get spending for a date range.
     */
    public function getSpentForDateRange(string $startDate, string $endDate): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');
    }

    /**
     * Get monthly spending trend for the last N months.
     */
    public function getMonthlyTrend(int $months = 6): array
    {
        $trend = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $trend[] = [
                'month' => $date->format('M Y'),
                'year' => $date->year,
                'month_num' => $date->month,
                'total' => $this->getSpentForMonth($date->month, $date->year),
            ];
        }
        return $trend;
    }

    /**
     * Get top expenses for this category.
     */
    public function getTopExpenses(int $limit = 5): array
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->orderBy('amount', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get budget utilization.
     */
    public function getBudgetUtilization(): array
    {
        $budget = $this->currentBudget()->first();
        if (!$budget) {
            return [
                'allocated' => 0,
                'spent' => 0,
                'remaining' => 0,
                'utilization' => 0,
                'is_over_budget' => false,
            ];
        }

        $spent = $this->monthly_spent;
        $allocated = $budget->pivot->allocated ?? 0;
        $remaining = $allocated - $spent;
        $utilization = $allocated > 0 ? ($spent / $allocated) * 100 : 0;

        return [
            'allocated' => $allocated,
            'spent' => $spent,
            'remaining' => $remaining,
            'utilization' => $utilization,
            'is_over_budget' => $remaining < 0,
        ];
    }

    /**
     * Check if category has budget for current month.
     */
    public function hasBudget(): bool
    {
        return $this->currentBudget()->exists();
    }

    /**
     * Get or create budget for current month.
     */
    public function getOrCreateBudget(float $amount = null): array
    {
        $budget = $this->currentBudget()->first();

        if (!$budget && $amount) {
            $budget = $this->budgets()->attach(
                Budget::firstOrCreate([
                    'user_id' => $this->user_id,
                    'month_year' => now()->format('Y-m-01'),
                ]),
                [
                    'allocated' => $amount,
                    'spent' => 0,
                    'remaining' => $amount,
                    'month_year' => now()->format('Y-m-01'),
                ]
            );
        }

        return $this->getBudgetUtilization();
    }

    /**
     * Calculate average monthly spending.
     */
    public function getAverageMonthlySpending(int $months = 3): float
    {
        $total = 0;
        for ($i = 0; $i < $months; $i++) {
            $date = now()->subMonths($i);
            $total += $this->getSpentForMonth($date->month, $date->year);
        }
        return $months > 0 ? $total / $months : 0;
    }

    /**
     * Get spending by day of week.
     */
    public function getSpendingByDayOfWeek(): array
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $spending = [];

        foreach ($days as $index => $day) {
            $spending[$day] = $this->expenses()
                ->where('is_archived', false)
                ->whereRaw("DAYOFWEEK(expense_date) = ?", [$index + 2])
                ->sum('amount');
        }

        return $spending;
    }

    /**
     * Get spending by merchant.
     */
    public function getSpendingByMerchant(): array
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->whereNotNull('merchant')
            ->selectRaw('merchant, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('merchant')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get average transaction amount.
     */
    public function getAverageTransactionAmount(): float
    {
        return $this->expenses()
            ->where('is_archived', false)
            ->avg('amount') ?? 0;
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    /**
     * Scope to expense categories only.
     */
    public function scopeExpenses($query)
    {
        return $query->where('type', 'expense');
    }

    /**
     * Scope to income categories only.
     */
    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    /**
     * Scope to savings categories only.
     */
    public function scopeSavings($query)
    {
        return $query->where('type', 'savings');
    }

    /**
     * Scope to default categories.
     */
    public function scopeDefaults($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to custom categories.
     */
    public function scopeCustom($query)
    {
        return $query->where('is_default', false);
    }

    /**
     * Scope to active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to search by name or description.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to order by name.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    /**
     * Scope to root categories (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to categories with active budgets.
     */
    public function scopeWithActiveBudgets($query)
    {
        return $query->whereHas('currentBudget');
    }

    // ─── Boot Methods ──────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            // Set default order if not set
            if (!isset($category->order)) {
                $category->order = Category::where('user_id', $category->user_id)
                    ->where('type', $category->type)
                    ->max('order') + 1;
            }

            // Set default color if not set
            if (!isset($category->color)) {
                $colors = ['#5CB85C', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                $category->color = $colors[array_rand($colors)];
            }

            // Set default icon if not set
            if (!isset($category->icon)) {
                $icons = ['mdi:folder', 'mdi:chart-bar', 'mdi:cash', 'mdi:home', 'mdi:car', 'mdi:cart', 'mdi:food', 'mdi:gamepad', 'mdi:book', 'mdi:laptop'];
                $category->icon = $icons[array_rand($icons)];
            }
        });

        static::deleting(function (Category $category) {
            // Soft delete related expenses
            $category->expenses()->delete();

            // Detach from budgets
            $category->budgets()->detach();
        });
    }

    // ─── Static Methods ────────────────────────────────────────────

    /**
     * Get default categories for a user.
     */
    public static function getDefaultCategories(int $userId): array
    {
        return [
            [
                'user_id' => $userId,
                'name' => 'Food & Dining',
                'icon' => 'mdi:food',
                'color' => '#10B981',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Shopping',
                'icon' => 'mdi:shopping',
                'color' => '#8B5CF6',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Transportation',
                'icon' => 'mdi:car',
                'color' => '#3B82F6',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Bills & Utilities',
                'icon' => 'mdi:file-document',
                'color' => '#F59E0B',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Healthcare',
                'icon' => 'mdi:heart-pulse',
                'color' => '#EC4899',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Education',
                'icon' => 'mdi:school',
                'color' => '#06B6D4',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Entertainment',
                'icon' => 'mdi:gamepad',
                'color' => '#8B5CF6',
                'type' => 'expense',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Salary',
                'icon' => 'mdi:cash',
                'color' => '#10B981',
                'type' => 'income',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Freelance',
                'icon' => 'mdi:laptop',
                'color' => '#8B5CF6',
                'type' => 'income',
                'is_default' => true,
            ],
            [
                'user_id' => $userId,
                'name' => 'Savings',
                'icon' => 'mdi:bank',
                'color' => '#06B6D4',
                'type' => 'savings',
                'is_default' => true,
            ],
        ];
    }

    /**
     * Get category types with labels.
     */
    public static function getTypes(): array
    {
        return [
            'expense' => 'Expense',
            'income' => 'Income',
            'savings' => 'Savings',
        ];
    }

    /**
     * Get color options.
     */
    public static function getColorOptions(): array
    {
        return [
            '#5CB85C' => 'Green',
            '#3B82F6' => 'Blue',
            '#EF4444' => 'Red',
            '#F59E0B' => 'Orange',
            '#8B5CF6' => 'Purple',
            '#EC4899' => 'Pink',
            '#06B6D4' => 'Cyan',
            '#10B981' => 'Emerald',
            '#F472B6' => 'Rose',
            '#6366F1' => 'Indigo',
        ];
    }

    /**
     * Get Iconify icon options.
     */
    public static function getIconOptions(): array
    {
        return [
            // Food & Dining
            'mdi:food' => 'Food',
            'mdi:food-apple' => 'Apple',
            'mdi:coffee' => 'Coffee',
            'mdi:silverware' => 'Silverware',
            'mdi:restaurant' => 'Restaurant',
            
            // Shopping
            'mdi:shopping' => 'Shopping',
            'mdi:shopping-outline' => 'Shopping Outline',
            'mdi:cart' => 'Cart',
            'mdi:cart-outline' => 'Cart Outline',
            'mdi:bag-personal' => 'Bag',
            
            // Transportation
            'mdi:car' => 'Car',
            'mdi:bus' => 'Bus',
            'mdi:train' => 'Train',
            'mdi:airplane' => 'Airplane',
            'mdi:gas-station' => 'Gas Station',
            'mdi:bike' => 'Bike',
            
            // Bills & Utilities
            'mdi:file-document' => 'Document',
            'mdi:home' => 'Home',
            'mdi:lightbulb' => 'Lightbulb',
            'mdi:water' => 'Water',
            'mdi:thermometer' => 'Thermometer',
            'mdi:phone' => 'Phone',
            'mdi:internet' => 'Internet',
            
            // Healthcare
            'mdi:heart-pulse' => 'Heart',
            'mdi:hospital' => 'Hospital',
            'mdi:medical-bag' => 'Medical Bag',
            'mdi:pill' => 'Pill',
            'mdi:tooth' => 'Dental',
            
            // Education
            'mdi:school' => 'School',
            'mdi:book' => 'Book',
            'mdi:bookshelf' => 'Bookshelf',
            'mdi:graduation-cap' => 'Graduation',
            
            // Entertainment
            'mdi:gamepad' => 'Game',
            'mdi:movie' => 'Movie',
            'mdi:music' => 'Music',
            'mdi:theater' => 'Theater',
            'mdi:bowling' => 'Bowling',
            
            // Income
            'mdi:cash' => 'Cash',
            'mdi:cash-multiple' => 'Cash Multiple',
            'mdi:laptop' => 'Laptop',
            'mdi:briefcase' => 'Briefcase',
            'mdi:bank' => 'Bank',
            
            // General
            'mdi:folder' => 'Folder',
            'mdi:chart-bar' => 'Chart Bar',
            'mdi:chart-pie' => 'Chart Pie',
            'mdi:target' => 'Target',
            'mdi:gift' => 'Gift',
            'mdi:star' => 'Star',
            'mdi:heart' => 'Heart',
            'mdi:fire' => 'Fire',
            'mdi:cube' => 'Cube',
            'mdi:rocket' => 'Rocket',
            
            // Personal Care
            'mdi:spa' => 'Spa',
            'mdi:toothbrush' => 'Toothbrush',
            'mdi:human' => 'Person',
            
            // Pets
            'mdi:paw' => 'Paw',
            'mdi:dog' => 'Dog',
            'mdi:cat' => 'Cat',
            
            // Tech
            'mdi:cellphone' => 'Phone',
            'mdi:desktop-classic' => 'Desktop',
            'mdi:headphones' => 'Headphones',
            
            // Travel
            'mdi:beach' => 'Beach',
            'mdi:campfire' => 'Campfire',
            'mdi:luggage' => 'Luggage',
        ];
    }

    /**
     * Get icon categories for grouping.
     */
    public static function getIconCategories(): array
    {
        return [
            'Food & Dining' => [
                'mdi:food' => 'Food',
                'mdi:food-apple' => 'Apple',
                'mdi:coffee' => 'Coffee',
                'mdi:silverware' => 'Silverware',
                'mdi:restaurant' => 'Restaurant',
            ],
            'Shopping' => [
                'mdi:shopping' => 'Shopping',
                'mdi:cart' => 'Cart',
                'mdi:bag-personal' => 'Bag',
            ],
            'Transportation' => [
                'mdi:car' => 'Car',
                'mdi:bus' => 'Bus',
                'mdi:train' => 'Train',
                'mdi:airplane' => 'Airplane',
                'mdi:gas-station' => 'Gas Station',
                'mdi:bike' => 'Bike',
            ],
            'Bills & Utilities' => [
                'mdi:file-document' => 'Document',
                'mdi:home' => 'Home',
                'mdi:lightbulb' => 'Lightbulb',
                'mdi:water' => 'Water',
                'mdi:phone' => 'Phone',
                'mdi:internet' => 'Internet',
            ],
            'Healthcare' => [
                'mdi:heart-pulse' => 'Heart',
                'mdi:hospital' => 'Hospital',
                'mdi:medical-bag' => 'Medical Bag',
                'mdi:pill' => 'Pill',
            ],
            'Education' => [
                'mdi:school' => 'School',
                'mdi:book' => 'Book',
                'mdi:graduation-cap' => 'Graduation',
            ],
            'Entertainment' => [
                'mdi:gamepad' => 'Game',
                'mdi:movie' => 'Movie',
                'mdi:music' => 'Music',
                'mdi:theater' => 'Theater',
            ],
            'Income' => [
                'mdi:cash' => 'Cash',
                'mdi:cash-multiple' => 'Cash Multiple',
                'mdi:laptop' => 'Laptop',
                'mdi:briefcase' => 'Briefcase',
                'mdi:bank' => 'Bank',
            ],
            'General' => [
                'mdi:folder' => 'Folder',
                'mdi:chart-bar' => 'Chart Bar',
                'mdi:chart-pie' => 'Chart Pie',
                'mdi:target' => 'Target',
                'mdi:gift' => 'Gift',
                'mdi:star' => 'Star',
                'mdi:heart' => 'Heart',
                'mdi:fire' => 'Fire',
                'mdi:cube' => 'Cube',
                'mdi:rocket' => 'Rocket',
            ],
        ];
    }
}