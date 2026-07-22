@extends('layouts.export')

@section('content')
    {{-- Financial Summary --}}
    <div class="section">
        <h2 class="section-title">
            Financial Summary
        </h2>
        <div class="grid-4">
            <div class="stat-card">
                <div class="stat-label">Total Income</div>
                <div class="stat-value green">{{ $currency ?? '₱' }}{{ number_format($summary['total_income'] ?? 0, 2) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Expenses</div>
                <div class="stat-value red">{{ $currency ?? '₱' }}{{ number_format($summary['total_expenses'] ?? 0, 2) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Savings</div>
                <div class="stat-value blue">{{ $currency ?? '₱' }}{{ number_format($summary['total_savings'] ?? 0, 2) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Safe Balance</div>
                <div class="stat-value orange">{{ $currency ?? '₱' }}{{ number_format($summary['safe_balance'] ?? 0, 2) }}</div>
            </div>
        </div>

        <div class="grid-3" style="margin-top: 16px;">
            <div class="stat-card">
                <div class="stat-label">Net Balance</div>
                <div class="stat-value {{ ($summary['net_balance'] ?? 0) >= 0 ? 'green' : 'red' }}">
                    {{ $currency ?? '₱' }}{{ number_format($summary['net_balance'] ?? 0, 2) }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Transactions</div>
                <div class="stat-value gray">{{ number_format($summary['transaction_count'] ?? 0) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Largest Expense</div>
                <div class="stat-value red">{{ $currency ?? '₱' }}{{ number_format($summary['largest_expense'] ?? 0, 2) }}</div>
            </div>
        </div>
    </div>

    {{-- Monthly Spending Trend --}}
    @if(isset($monthly_trend) && count($monthly_trend) > 0)
    <div class="section">
        <h2 class="section-title">
            Monthly Spending Trend
        </h2>
        <div class="chart-container">
            <div class="chart-bars">
                @php
                    $maxAmount = max(array_column($monthly_trend, 'amount'));
                    $maxAmount = $maxAmount > 0 ? $maxAmount : 1;
                    $currencySymbol = $currency ?? '₱';
                @endphp
                @foreach($monthly_trend as $month)
                    @php
                        $height = ($month['amount'] / $maxAmount) * 100;
                        $color = $month['amount'] > 0 ? '#5CB85C' : '#e5e5e5';
                        $isHigh = $height > 70;
                    @endphp
                    <div class="chart-bar-item">
                        <div class="chart-bar-value">{{ $currencySymbol }}{{ number_format($month['amount'], 0) }}</div>
                        <div class="chart-bar" style="height: {{ max($height, 2) }}%; background: {{ $isHigh ? '#EF4444' : $color }};"></div>
                        <div class="chart-bar-label">{{ $month['month'] }}</div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
    @endif

    {{-- Pockets Overview --}}
    <div class="section">
        <h2 class="section-title">
            Pockets Overview
        </h2>

        @if(isset($pockets) && $pockets->isNotEmpty())
            @php $currencySymbol = $currency ?? '₱'; @endphp

            <table>
                <thead>
                    <tr>
                        <th>Pocket Name</th>
                        <th class="text-right">Allocated</th>
                        <th class="text-right">Spent (Period)</th>
                        <th class="text-right">Remaining</th>
                        <th class="text-right">Utilization</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pockets as $pocket)
                        @php
                            $spent = $pocket->period_spent ?? 0;
                            $allocated = $pocket->allocated ?? 0;
                            $remaining = $allocated - $spent;
                            $utilization = $allocated > 0
                                ? round(($spent / $allocated) * 100, 1)
                                : 0;

                            $statusClass = $utilization >= 80
                                ? 'text-danger'
                                : ($utilization >= 50 ? 'text-warning' : 'text-success');

                            $badgeClass = $utilization >= 80
                                ? 'badge-danger'
                                : ($utilization >= 50 ? 'badge-warning' : 'badge-healthy');

                            $badgeText = $utilization >= 80
                                ? 'Over Budget'
                                : ($utilization >= 50 ? 'Near Limit' : 'Healthy');
                        @endphp

                        <tr>
                            <td>
                                <span class="color-dot"
                                      style="background: {{ $pocket->color ?? '#5CB85C' }};">
                                </span>

                                {{ $pocket->name }}
                            </td>

                            <td class="text-right">
                                {{ $currencySymbol }}{{ number_format($allocated, 2) }}
                            </td>

                            <td class="text-right text-danger">
                                {{ $currencySymbol }}{{ number_format($spent, 2) }}
                            </td>

                            <td class="text-right text-success">
                                {{ $currencySymbol }}{{ number_format($remaining, 2) }}
                            </td>

                            <td class="text-right">
                                <span class="{{ $statusClass }} font-bold">
                                    {{ $utilization }}%
                                </span>

                                <span class="badge {{ $badgeClass }}">
                                    {{ $badgeText }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

        @else
            <p class="text-muted text-center" style="padding:20px 0;">
                No pockets created yet.
            </p>
        @endif
    </div>

    {{-- Expense Details --}}
    <div class="section">
        <h2 class="section-title">
            Expense Details
        </h2>
        @if(isset($expenses) && $expenses->count() > 0)
            @php $currencySymbol = $currency ?? '₱'; @endphp
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
                        <td class="text-right text-danger font-bold">-{{ $currencySymbol }}{{ number_format($expense->amount, 2) }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="4" class="text-right">Total Expenses:</td>
                        <td class="text-right text-danger">{{ $currencySymbol }}{{ number_format($summary['total_expenses'] ?? 0, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        @else
            <p class="text-muted text-center" style="padding: 20px 0;">No expenses recorded in this period.</p>
        @endif
    </div>

    {{-- Savings Goals --}}
    <div class="section">
        <h2 class="section-title">
            Savings Goals
        </h2>
        @if(isset($savings) && $savings->count() > 0)
            @php $currencySymbol = $currency ?? '₱'; @endphp
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
                        $isComplete = $progress >= 100;
                    @endphp
                    <tr>
                        <td>{{ $goal->name }}</td>
                        <td class="text-right">{{ $currencySymbol }}{{ number_format($goal->target_amount, 2) }}</td>
                        <td class="text-right">{{ $currencySymbol }}{{ number_format($goal->current_amount, 2) }}</td>
                        <td class="text-right">
                            <span class="font-bold" style="color: {{ $isComplete ? '#10B981' : '#3B82F6' }};">
                                {{ $progress }}%
                            </span>
                        </td>
                        <td>
                            @if($isComplete)
                                <span class="badge badge-completed">Completed</span>
                            @else
                                <span class="badge badge-in-progress">In Progress</span>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="text-muted text-center" style="padding: 20px 0;">No savings goals created yet.</p>
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
                <p style="font-size: 10px; color: #9ca3af; margin-top: 2px;">
                    LedgerLeaf - Smart Budgeting Made Simple
                </p>
            </div>
        </div>
    </div>
@endsection
