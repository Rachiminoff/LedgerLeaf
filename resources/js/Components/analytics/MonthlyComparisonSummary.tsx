// resources/js/Components/analytics/MonthlyComparisonSummary.tsx
import React from 'react';
import { Icon } from '@iconify/react';

interface MonthlyComparisonSummaryProps {
    currentMonth: {
        income: number;
        expenses: number;
        savings: number;
    };
    previousMonth: {
        income: number;
        expenses: number;
        savings: number;
    };
}

export default function MonthlyComparisonSummary({
    currentMonth,
    previousMonth,
}: MonthlyComparisonSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return { value: 0, direction: 'neutral' };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change),
            direction: change >= 0 ? 'up' : 'down',
        };
    };

    const incomeChange = calculateChange(currentMonth.income, previousMonth.income);
    const expenseChange = calculateChange(currentMonth.expenses, previousMonth.expenses);
    const savingsChange = calculateChange(currentMonth.savings, previousMonth.savings);

    const summaryItems = [
        {
            label: 'Income',
            current: currentMonth.income,
            previous: previousMonth.income,
            change: incomeChange,
            icon: 'mdi:arrow-up',
            color: '#5CB85C',
        },
        {
            label: 'Expenses',
            current: currentMonth.expenses,
            previous: previousMonth.expenses,
            change: expenseChange,
            icon: 'mdi:arrow-down',
            color: '#FF5A5A',
        },
        {
            label: 'Savings',
            current: currentMonth.savings,
            previous: previousMonth.savings,
            change: savingsChange,
            icon: 'mdi:arrow-up',
            color: '#3B82F6',
        },
    ];

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
            <h3 className="text-sm font-medium text-white mb-4">Monthly Comparison</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {summaryItems.map((item) => (
                    <div key={item.label} className="bg-[#1A1A1A] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#9A9A9A]">{item.label}</span>
                            <span
                                className={`text-[10px] font-medium ${
                                    item.change.direction === 'up'
                                        ? 'text-[#5CB85C]'
                                        : item.change.direction === 'down'
                                        ? 'text-[#FF5A5A]'
                                        : 'text-[#9A9A9A]'
                                }`}
                            >
                                {item.change.direction !== 'neutral' && (
                                    <>
                                        {item.change.direction === 'up' ? '↑' : '↓'}
                                        {item.change.value.toFixed(1)}%
                                    </>
                                )}
                            </span>
                        </div>
                        <p className="text-lg font-semibold text-white">
                            {formatCurrency(item.current)}
                        </p>
                        <p className="text-[10px] text-[#9A9A9A]">
                            Last month: {formatCurrency(item.previous)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Net Change Summary */}
            <div className="mt-3 pt-3 border-t border-[#242424] flex items-center justify-between">
                <span className="text-xs text-[#9A9A9A]">Net Change</span>
                <span className="text-sm font-semibold" style={{
                    color: (currentMonth.income - currentMonth.expenses) >= 0 ? '#5CB85C' : '#FF5A5A',
                }}>
                    {formatCurrency(currentMonth.income - currentMonth.expenses)}
                </span>
            </div>
        </div>
    );
}