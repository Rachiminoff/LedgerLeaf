import React from 'react'
import { Icon } from '@iconify/react'

interface QuickStatisticsProps {
    stats: {
        total_transactions: number
        average_expense: number
        largest_expense: number
        smallest_expense: number
        active_pockets: number
        completed_goals: number
    }
}

export default function QuickStatistics({ stats }: QuickStatisticsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const items = [
        {
            id: 'transactions',
            label: 'Total Transactions',
            value: stats.total_transactions.toString(),
            icon: 'mdi:receipt-outline',
            color: '#5CB85C',
        },
        {
            id: 'average',
            label: 'Average Expense',
            value: formatCurrency(stats.average_expense),
            icon: 'mdi:calculator',
            color: '#3B82F6',
        },
        {
            id: 'largest',
            label: 'Largest Expense',
            value: formatCurrency(stats.largest_expense),
            icon: 'mdi:arrow-up',
            color: '#EF4444',
        },
        {
            id: 'smallest',
            label: 'Smallest Expense',
            value: formatCurrency(stats.smallest_expense),
            icon: 'mdi:arrow-down',
            color: '#F59E0B',
        },
        {
            id: 'pockets',
            label: 'Active Pockets',
            value: stats.active_pockets.toString(),
            icon: 'mdi:folder-multiple',
            color: '#8B5CF6',
        },
        {
            id: 'goals',
            label: 'Completed Goals',
            value: stats.completed_goals.toString(),
            icon: 'mdi:target',
            color: '#10B981',
        },
    ]

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Quick Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                    <div key={item.id} className="bg-[#1A1A1A] rounded-xl p-3 hover:bg-[#242424] transition-all duration-200">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#171717]" style={{ color: item.color }}>
                                <Icon icon={item.icon} className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-[#9A9A9A] truncate">{item.label}</p>
                                <p className="text-sm font-semibold text-white truncate">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}