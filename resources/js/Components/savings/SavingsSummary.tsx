import React from 'react';
import { Icon } from '@iconify/react';

interface SavingsSummaryProps {
    summary: {
        safe_balance: number;
        total_saved: number;
        active_goals: number;
        completed_goals: number;
    };
}

export default function SavingsSummary({ summary }: SavingsSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            id: 'safe_balance',
            label: 'Available Safe Balance',
            value: formatCurrency(summary.safe_balance),
            icon: 'mdi:shield-outline',
            color: '#5CB85C',
        },
        {
            id: 'total_saved',
            label: 'Total Saved',
            value: formatCurrency(summary.total_saved),
            icon: 'mdi:bank',
            color: '#3B82F6',
        },
        {
            id: 'active_goals',
            label: 'Active Goals',
            value: summary.active_goals.toString(),
            icon: 'mdi:target',
            color: '#8B5CF6',
        },
        {
            id: 'completed_goals',
            label: 'Completed',
            value: summary.completed_goals.toString(),
            icon: 'mdi:check-circle',
            color: '#10B981',
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#171717]" style={{ color: card.color }}>
                            <Icon icon={card.icon} className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-[#9A9A9A]">{card.label}</p>
                            <p className="text-lg font-bold text-white">{card.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}