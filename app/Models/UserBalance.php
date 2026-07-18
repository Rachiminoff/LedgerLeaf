<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_balance',
        'safe_balance',
        'allocated_to_pockets',
        'last_calculated_at',
    ];

    protected $casts = [
        'total_balance' => 'decimal:2',
        'safe_balance' => 'decimal:2',
        'allocated_to_pockets' => 'decimal:2',
        'last_calculated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}