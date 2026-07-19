<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }
}