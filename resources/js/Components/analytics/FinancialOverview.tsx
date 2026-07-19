import React from 'react'
import { Icon } from '@iconify/react'

interface FinancialOverviewProps {
    overview: {
        income: number
        expenses: number
        savings: number
        remaining: number
        expense_change: number
        expense_change_direction: 'up' | 'down'
    }
}

export default function FinancialOverview({ overview }: FinancialOverviewProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const cards = [
        {
            id: 'income',
            label: 'Income',
            value: formatCurrency(overview.income),
            icon: 'mdi:arrow-up-circle',
            color: '#5CB85C',
        },
        {
            id: 'expenses',
            label: 'Expenses',
            value: formatCurrency(overview.expenses),
            icon: 'mdi:arrow-down-circle',
            color: '#FF5A5A',
            trend: `${Math.abs(overview.expense_change)}%`,
            trendDirection: overview.expense_change_direction,
        },
        {
            id: 'savings',
            label: 'Savings',
            value: formatCurrency(overview.savings),
            icon: 'mdi:bank',
            color: '#3B82F6',
        },
        {
            id: 'remaining',
            label: 'Remaining Balance',
            value: formatCurrency(overview.remaining),
            icon: 'mdi:wallet',
            color: '#F59E0B',
        },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-300"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-[#9A9A9A] font-medium uppercase tracking-wider">
                                {card.label}
                            </p>
                            <p className="text-xl font-bold text-white mt-1.5 font-mono">
                                {card.value}
                            </p>
                            {card.trend && (
                                <div className={`flex items-center gap-1 mt-1.5 text-xs ${
                                    card.trendDirection === 'down' ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'
                                }`}>
                                    <Icon icon={card.trendDirection === 'down' ? 'mdi:arrow-down' : 'mdi:arrow-up'} className="w-3.5 h-3.5" />
                                    <span>{card.trend}</span>
                                    <span className="text-[#9A9A9A]">vs previous</span>
                                </div>
                            )}
                        </div>
                        <div className="p-2 rounded-lg bg-[#171717]" style={{ color: card.color }}>
                            <Icon icon={card.icon} className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}