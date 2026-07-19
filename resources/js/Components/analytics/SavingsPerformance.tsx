import React from 'react'
import { Icon } from '@iconify/react'

interface SavingsPerformanceProps {
    data: {
        total_saved: number
        total_target: number
        completed_goals: number
        active_goals: number
        savings_rate: number
        progress_percentage: number
    }
}

export default function SavingsPerformance({ data }: SavingsPerformanceProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const stats = [
        {
            id: 'total_saved',
            label: 'Total Saved',
            value: formatCurrency(data.total_saved),
            icon: 'mdi:bank',
            color: '#5CB85C',
        },
        {
            id: 'savings_rate',
            label: 'Monthly Savings Rate',
            value: formatCurrency(data.savings_rate),
            icon: 'mdi:chart-line',
            color: '#3B82F6',
        },
        {
            id: 'completed_goals',
            label: 'Completed Goals',
            value: data.completed_goals.toString(),
            icon: 'mdi:check-circle',
            color: '#10B981',
        },
        {
            id: 'active_goals',
            label: 'Active Goals',
            value: data.active_goals.toString(),
            icon: 'mdi:target',
            color: '#8B5CF6',
        },
    ]

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Savings Performance</h3>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-[#9A9A9A] mb-1">
                    <span>Overall Progress</span>
                    <span>{data.progress_percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.min(data.progress_percentage, 100)}%`,
                            backgroundColor: '#5CB85C',
                        }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-[#9A9A9A] mt-1">
                    <span>Saved: {formatCurrency(data.total_saved)}</span>
                    <span>Target: {formatCurrency(data.total_target)}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-[#1A1A1A] rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#171717]" style={{ color: stat.color }}>
                                <Icon icon={stat.icon} className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-[#9A9A9A] truncate">{stat.label}</p>
                                <p className="text-sm font-semibold text-white truncate">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}