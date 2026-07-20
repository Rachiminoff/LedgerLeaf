import React from 'react';
import { Icon } from '@iconify/react';

interface Statistics {
    safe_balance: number;
    total_balance: number;
    active_pockets: number;
    total_expenses: number;
    active_savings_goals: number;
}

interface Props {
    statistics: Statistics;
}

export default function FinancialOverview({ statistics }: Props) {
    const stats = [
        {
            label: 'Safe Balance',
            value: statistics.safe_balance,
            icon: 'mdi:shield-check',
            color: '#5CB85C',
            format: 'currency',
        },
        {
            label: 'Total Balance',
            value: statistics.total_balance,
            icon: 'mdi:wallet',
            color: '#3B82F6',
            format: 'currency',
        },
        {
            label: 'Active Pockets',
            value: statistics.active_pockets,
            icon: 'mdi:folder-outline',
            color: '#F59E0B',
            format: 'number',
        },
        {
            label: 'Total Expenses',
            value: statistics.total_expenses,
            icon: 'mdi:trending-down',
            color: '#EF4444',
            format: 'currency',
        },
        {
            label: 'Active Savings',
            value: statistics.active_savings_goals,
            icon: 'mdi:piggy-bank',
            color: '#8B5CF6',
            format: 'number',
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const formatValue = (value: number, format: string) => {
        return format === 'currency' ? formatCurrency(value) : formatNumber(value);
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Financial Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-[#171717] rounded-xl p-4 border border-[#242424] hover:border-[#5CB85C] transition-all duration-200"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon
                                icon={stat.icon}
                                className="w-4 h-4"
                                style={{ color: stat.color }}
                            />
                            <span className="text-xs text-[#9A9A9A]">{stat.label}</span>
                        </div>
                        <p className="text-lg font-semibold text-white">
                            {formatValue(stat.value, stat.format)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}