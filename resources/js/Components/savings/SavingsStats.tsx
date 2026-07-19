import React from 'react'
import { Icon } from '@iconify/react'

interface SavingsStatsProps {
    goals: any[]
}

export default function SavingsStats({ goals }: SavingsStatsProps) {
    // Calculate stats from goals
    const activeGoals = goals.filter((g: any) => !g.is_archived && !g.is_completed)
    const completedGoals = goals.filter((g: any) => !g.is_archived && g.is_completed)
    const archivedGoals = goals.filter((g: any) => g.is_archived)
    
    const totalSaved = goals
        .filter((g: any) => !g.is_archived)
        .reduce((sum: number, g: any) => sum + (g.current_amount || 0), 0)
    
    const totalTarget = goals
        .filter((g: any) => !g.is_archived)
        .reduce((sum: number, g: any) => sum + (g.target_amount || 0), 0)
    
    const averageProgress = activeGoals.length > 0 
        ? activeGoals.reduce((sum: number, g: any) => sum + (g.progress_percentage || 0), 0) / activeGoals.length 
        : 0

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
            id: 'total_saved',
            label: 'Total Saved',
            value: formatCurrency(totalSaved),
            icon: 'mdi:bank',
            color: '#5CB85C',
            subtitle: `${activeGoals.length} active goals`,
        },
        {
            id: 'active_goals',
            label: 'Active Goals',
            value: activeGoals.length.toString(),
            icon: 'mdi:target',
            color: '#3B82F6',
            subtitle: `${completedGoals.length} completed`,
        },
        {
            id: 'average_progress',
            label: 'Average Progress',
            value: `${averageProgress.toFixed(0)}%`,
            icon: 'mdi:chart-line',
            color: '#8B5CF6',
            subtitle: `of ${activeGoals.length} goals`,
        },
        {
            id: 'archived',
            label: 'Archived Goals',
            value: archivedGoals.length.toString(),
            icon: 'mdi:archive',
            color: '#9A9A9A',
            subtitle: 'View archived',
        },
    ]

    if (goals.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Savings Stats</h3>
                <div className="text-center py-6">
                    <Icon icon="mdi:chart-bar" className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
                    <p className="text-sm text-[#9A9A9A]">No stats available</p>
                    <p className="text-xs text-[#6B7280] mt-1">Create your first savings goal</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Savings Stats</h3>
            <div className="grid grid-cols-2 gap-3">
                {cards.map((card) => {
                    const IconComponent = card.icon
                    return (
                        <div
                            key={card.id}
                            className="bg-[#1A1A1A] rounded-xl p-3 hover:bg-[#242424] transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-[#171717]" style={{ color: card.color }}>
                                    <Icon icon={card.icon} className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#9A9A9A] truncate">{card.label}</p>
                                    <p className="text-sm font-semibold text-white truncate">{card.value}</p>
                                    {card.subtitle && (
                                        <p className="text-[10px] text-[#9A9A9A] truncate">{card.subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Progress Summary */}
            {activeGoals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#242424]">
                    <div className="flex justify-between text-xs text-[#9A9A9A] mb-1">
                        <span>Overall Progress</span>
                        <span>{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%`,
                                backgroundColor: '#5CB85C',
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#9A9A9A] mt-1">
                        <span>Saved: {formatCurrency(totalSaved)}</span>
                        <span>Target: {formatCurrency(totalTarget)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}