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
        <div class="grid-2" style="margin-top: 15px;">
            <div class="stat-card">
                <div class="stat-label">Net Balance</div>
                <div class="stat-value {{ ($summary['net_balance'] ?? 0) >= 0 ? 'green' : 'red' }}">
                    ₱{{ number_format($summary['net_balance'] ?? 0, 2) }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Report Period</div>
                <div class="stat-value" style="font-size: 14px; color: #4b5563;">
                    {{ $period['start'] ?? 'N/A' }} - {{ $period['end'] ?? 'N/A' }}
                </div>
            </div>
        </div>
    </div>

    {{-- Pockets Summary --}}
    <div class="section">
        <h2 class="section-title">Pockets Overview</h2>
        @if(isset($pockets) && $pockets->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Pocket Name</th>
                        <th class="text-right">Allocated</th>
                        <th class="text-right">Spent</th>
                        <th class="text-right">Remaining</th>
                        <th class="text-right">Utilization</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pockets as $pocket)
                        @php
                            $utilization = $pocket->allocated > 0 
                                ? round(($pocket->spent / $pocket->allocated) * 100, 1) 
                                : 0;
                        @endphp
                        <tr>
                            <td>
                                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: {{ $pocket->color ?? '#5CB85C' }}; margin-right: 8px;"></span>
                                {{ $pocket->name }}
                            </td>
                            <td class="text-right">₱{{ number_format($pocket->allocated, 2) }}</td>
                            <td class="text-right" style="color: #EF4444;">₱{{ number_format($pocket->spent, 2) }}</td>
                            <td class="text-right" style="color: #5CB85C;">₱{{ number_format($pocket->allocated - $pocket->spent, 2) }}</td>
                            <td class="text-right">
                                <span style="color: {{ $utilization > 80 ? '#EF4444' : ($utilization > 50 ? '#F59E0B' : '#5CB85C') }}">
                                    {{ $utilization }}%
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="color: #6b7280; text-align: center; padding: 20px 0;">
                No pockets created yet.
            </p>
        @endif
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
                        <th>Payment Method</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($expenses as $expense)
                    <tr>
                        <td>{{ $expense->expense_date }}</td>
                        <td>{{ $expense->description }}</td>
                        <td>{{ $expense->pocket?->name ?? 'Uncategorized' }}</td>
                        <td>{{ $expense->payment_method ?? 'N/A' }}</td>
                        <td class="text-right" style="color: #EF4444; font-weight: 600;">
                            -₱{{ number_format($expense->amount, 2) }}
                        </td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="4" class="text-right">Total Expenses:</td>
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
                        <td class="text-right">
                            <span style="color: {{ $progress >= 100 ? '#5CB85C' : '#3B82F6' }}">
                                {{ $progress }}%
                            </span>
                        </td>
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

    {{-- Summary Footer --}}
    <div class="section" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
        <div class="grid-2">
            <div>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Generated For</p>
                <p style="font-weight: 600;">{{ $user->name ?? 'User' }}</p>
                <p style="font-size: 12px; color: #6b7280;">{{ $user->email ?? '' }}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Generated On</p>
                <p style="font-weight: 600;">{{ $generated_at ?? now()->format('F j, Y g:i A') }}</p>
            </div>
        </div>
    </div>
@endsection