<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use SoftDeletes;

    protected $table = 'expenses';

    protected $fillable = [
        'user_id',
        'category_id',
        'pocket_id',
        'amount',
        'description',
        'merchant',
        'payment_method',
        'expense_date',
        'receipt_url',
        'tags',
        'notes',
        'is_archived',
        'type',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'is_archived' => 'boolean',
        'tags' => 'array',
    ];

    // ─── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function pocket(): BelongsTo
    {
        return $this->belongsTo(Pocket::class);
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }

    public function scopeDateBetween($query, $start, $end)
    {
        return $query->whereBetween('expense_date', [$start, $end]);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('description', 'like', "%{$search}%")
                ->orWhere('merchant', 'like', "%{$search}%")
                ->orWhere('notes', 'like', "%{$search}%");
        });
    }

    // ─── Accessors ─────────────────────────────────────────────────

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2);
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->expense_date ? $this->expense_date->format('M d, Y') : '';
    }
}