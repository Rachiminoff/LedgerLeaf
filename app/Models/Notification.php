<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category',
        'title',
        'message',
        'is_read',
        'data',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCategoryIconAttribute(): string
    {
        return match ($this->category) {
            'budget' => 'mdi:alert-circle',
            'savings' => 'mdi:target',
            'insight' => 'mdi:chart-line',
            'monthly' => 'mdi:calendar-month',
            default => 'mdi:bell-outline',
        };
    }

    public function getCategoryColorAttribute(): string
    {
        return match ($this->category) {
            'budget' => '#EF4444',
            'savings' => '#8B5CF6',
            'insight' => '#3B82F6',
            'monthly' => '#F59E0B',
            default => '#5CB85C',
        };
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'budget' => 'Budget Alert',
            'savings' => 'Savings Update',
            'insight' => 'Financial Insight',
            'monthly' => 'Monthly Summary',
            default => 'Notification',
        };
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeCategory($query, $category)
    {
        if ($category && $category !== 'all') {
            return $query->where('category', $category);
        }
        return $query;
    }

    public function markAsRead(): bool
    {
        $this->is_read = true;
        $this->read_at = now();
        return $this->save();
    }

    public function markAsUnread(): bool
    {
        $this->is_read = false;
        $this->read_at = null;
        return $this->save();
    }
}