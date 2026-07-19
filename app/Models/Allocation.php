<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allocation extends Model
{
    protected $table = 'allocations';

    protected $fillable = [
        'user_id',
        'pocket_id',
        'from_pocket_id',
        'to_pocket_id',
        'amount',
        'type',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pocket()
    {
        return $this->belongsTo(Pocket::class);
    }
}