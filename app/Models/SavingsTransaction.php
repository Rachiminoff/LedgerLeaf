<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingsTransaction extends Model
{
    protected $table = 'savings_transactions';

    protected $fillable = [
        'user_id',
        'savings_goal_id',
        'type',
        'amount',
        'notes',
        'balance_after',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_amount',
        'formatted_balance_after',
        'type_label',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function savingsGoal(): BelongsTo
    {
        return $this->belongsTo(SavingsGoal::class);
    }

    // ─── Accessors ──────────────────────────────────────────────────

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2);
    }

    public function getFormattedBalanceAfterAttribute(): string
    {
        return number_format($this->balance_after, 2);
    }

    public function getTypeLabelAttribute(): string
    {
        return ucfirst($this->type);
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    public function scopeDeposits($query)
    {
        return $query->where('type', 'deposit');
    }

    public function scopeWithdrawals($query)
    {
        return $query->where('type', 'withdraw');
    }

    public function scopeDateBetween($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }
}