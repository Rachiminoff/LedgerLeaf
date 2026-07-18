<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Pocket;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddFundsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->refresh();

        $safeBalance = $user->safe_balance ?? 0;
        $pocketBalance = Pocket::where('user_id', $user->id)->sum('current_amount') ?? 0;

        $destinations = [
            ['id' => 'safe_balance', 'name' => 'Safe Balance', 'type' => 'wallet'],
        ];

        $recentDeposits = Transaction::where('user_id', $user->id)
            ->where('type', 'deposit')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                ];
            });

        return Inertia::render('AddFunds', [
            'auth' => [
                'user' => $user,
            ],
            'balances' => [
                'safe_balance' => $safeBalance,
                'pocket_balance' => $pocketBalance,
                'total_balance' => $safeBalance + $pocketBalance,
            ],
            'destinations' => $destinations,
            'recentDeposits' => $recentDeposits,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'destination' => 'required|string',
            'amount' => 'required|numeric|min:0.01|max:1000000',
            'description' => 'nullable|string|max:150',
            'date' => 'required|date',
        ]);

        $user = Auth::user();
        $amount = $request->amount;

        DB::transaction(function () use ($user, $request, $amount) {
            // Get current balances before update
            $oldSafeBalance = $user->safe_balance ?? 0;
            $oldTotalBalance = $user->total_balance ?? 0;

            // Create transaction record
            Transaction::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'type' => 'deposit',
                'description' => $request->description ?? 'Fund deposit',
                'date' => $request->date,
            ]);

            // Update both safe balance AND total balance
            $user->safe_balance = $oldSafeBalance + $amount;
            $user->total_balance = $oldTotalBalance + $amount;
            $user->save();

            // Create audit log
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'deposit',
                'table_name' => 'users',
                'record_id' => $user->id,
                'old_values' => json_encode([
                    'safe_balance' => $oldSafeBalance,
                    'total_balance' => $oldTotalBalance,
                ]),
                'new_values' => json_encode([
                    'safe_balance' => $user->safe_balance,
                    'total_balance' => $user->total_balance,
                ]),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return redirect()->back()->with('success', 'Funds added successfully!');
    }
}