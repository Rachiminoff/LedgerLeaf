// app/Models/Pocket.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pocket extends Model
{
    use SoftDeletes;

    protected $table = 'pockets';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'icon',
        'color',
        'allocated',
        'balance',
        'spent',
        'is_default',
        'order',
        'is_archived',
    ];

    protected $casts = [
        'allocated' => 'decimal:2',
        'balance' => 'decimal:2',
        'spent' => 'decimal:2',
        'is_default' => 'boolean',
        'is_archived' => 'boolean',
    ];

    protected $appends = [
        'remaining',
        'progress',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    public function getRemainingAttribute(): float
    {
        return $this->allocated - $this->spent;
    }

    public function getProgressAttribute(): float
    {
        if ($this->allocated === 0) {
            return 0;
        }
        return min(($this->spent / $this->allocated) * 100, 100);
    }

    public function deductBalance(float $amount): void
    {
        $this->balance -= $amount;
        $this->spent += $amount;
        $this->save();
    }

    public function addBalance(float $amount): void
    {
        $this->balance += $amount;
        $this->allocated += $amount;
        $this->save();
    }

    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }
}