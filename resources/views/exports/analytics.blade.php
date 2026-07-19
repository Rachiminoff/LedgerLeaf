@extends('layouts.export')

@section('content')
    {{-- Financial Summary --}}
    <div class="section">
        <h2 class="section-title">Financial Summary</h2>
        <div class="grid-4">
            <div class="stat-card">
                <div class="stat-label">Total Income</div>
                <div class="stat-value green">
                    ₱{{ number_format($summary['total_income'] ?? 0, 2) }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Expenses</div>
                <div class="stat-value red">
                    ₱{{ number_format($summary['total_expenses'] ?? 0, 2) }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Savings</div>
                <div class="stat-value blue">
                    ₱{{ number_format($summary['total_savings'] ?? 0, 2) }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Safe Balance</div>
                <div class="stat-value orange">
                    ₱{{ number_format($summary['safe_balance'] ?? 0, 2) }}
                </div>
            </div>
        </div>
    </div>

    {{-- Expenses --}}
    <div class="section">
        <h2 class="section-title">Expense Details</h2>
        @if(isset($expenses) && $expenses->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Pocket</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($expenses as $expense)
                    <tr>
                        <td>{{ $expense->expense_date }}</td>
                        <td>{{ $expense->description }}</td>
                        <td>{{ $expense->pocket?->name ?? 'Uncategorized' }}</td>
                        <td class="text-right" style="color: #EF4444; font-weight: 600;">
                            -₱{{ number_format($expense->amount, 2) }}
                        </td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="3" class="text-right">Total Expenses:</td>
                        <td class="text-right" style="color: #EF4444;">
                            ₱{{ number_format($summary['total_expenses'] ?? 0, 2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        @else
            <p style="color: #6b7280; text-align: center; padding: 20px 0;">
                No expenses recorded in this period.
            </p>
        @endif
    </div>

    {{-- Savings Goals --}}
    <div class="section">
        <h2 class="section-title">Savings Goals</h2>
        @if(isset($savings) && $savings->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Goal Name</th>
                        <th class="text-right">Target</th>
                        <th class="text-right">Current</th>
                        <th class="text-right">Progress</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($savings as $goal)
                    @php
                        $progress = $goal->target_amount > 0
                            ? round(($goal->current_amount / $goal->target_amount) * 100, 1)
                            : 0;
                    @endphp
                    <tr>
                        <td>{{ $goal->name }}</td>
                        <td class="text-right">₱{{ number_format($goal->target_amount, 2) }}</td>
                        <td class="text-right">₱{{ number_format($goal->current_amount, 2) }}</td>
                        <td class="text-right">{{ $progress }}%</td>
                        <td>
                            @if($goal->is_completed)
                                <span class="badge badge-completed">✓ Completed</span>
                            @else
                                <span class="badge badge-in-progress">In Progress</span>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="color: #6b7280; text-align: center; padding: 20px 0;">
                No savings goals created yet.
            </p>
        @endif
    </div>
@endsection