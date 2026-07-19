<?php
// app/Models/SavingsGoal.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SavingsGoal extends Model
{
    use SoftDeletes;

    protected $table = 'savings_goals';

    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'current_amount',
        'target_date',
        'description',
        'is_completed',
        'completed_at',
        'is_archived',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'is_completed' => 'boolean',
        'is_archived' => 'boolean',
        'target_date' => 'date',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'progress_percentage',
        'remaining_amount',
        'is_achieved',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(SavingsTransaction::class);
    }

    // ─── Accessors ──────────────────────────────────────────────────

    public function getProgressPercentageAttribute(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        return min(($this->current_amount / $this->target_amount) * 100, 100);
    }

    public function getRemainingAmountAttribute(): float
    {
        return max($this->target_amount - $this->current_amount, 0);
    }

    public function getIsAchievedAttribute(): bool
    {
        return $this->current_amount >= $this->target_amount;
    }

    public function getFormattedTargetAttribute(): string
    {
        return number_format($this->target_amount, 2);
    }

    public function getFormattedCurrentAttribute(): string
    {
        return number_format($this->current_amount, 2);
    }

    public function getFormattedRemainingAttribute(): string
    {
        return number_format($this->remaining_amount, 2);
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }

    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    public function scopeInProgress($query)
    {
        return $query->where('is_completed', false)
            ->where('current_amount', '>', 0);
    }

    public function scopeNotStarted($query)
    {
        return $query->where('is_completed', false)
            ->where('current_amount', '=', 0);
    }

    // ─── Helper Methods ────────────────────────────────────────────

    public function deposit(float $amount, string $notes = null): bool
    {
        if ($amount <= 0) {
            return false;
        }

        if ($this->is_archived) {
            return false;
        }

        if ($this->is_completed) {
            return false;
        }

        $this->current_amount += $amount;

        if ($this->current_amount >= $this->target_amount) {
            $this->is_completed = true;
            $this->completed_at = now();
        }

        return $this->save();
    }

    public function withdraw(float $amount, string $notes = null): bool
    {
        if ($amount <= 0) {
            return false;
        }

        if ($this->is_archived) {
            return false;
        }

        if ($amount > $this->current_amount) {
            return false;
        }

        $this->current_amount -= $amount;

        if ($this->is_completed && $this->current_amount < $this->target_amount) {
            $this->is_completed = false;
            $this->completed_at = null;
        }

        return $this->save();
    }

    public function complete(): bool
    {
        if ($this->is_archived) {
            return false;
        }

        $this->is_completed = true;
        $this->completed_at = now();

        return $this->save();
    }

    public function archive(): bool
    {
        $this->is_archived = true;
        return $this->save();
    }

    public function restore(): bool
    {
        $this->is_archived = false;
        return $this->save();
    }
}