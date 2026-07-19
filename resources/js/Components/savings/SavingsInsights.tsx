import React from 'react'
import { Icon } from '@iconify/react'

interface SavingsInsightsProps {
    goals: any[]
    summary: {
        safe_balance: number
        total_saved: number
        active_goals: number
        completed_goals: number
    }
}

export default function SavingsInsights({ goals, summary }: SavingsInsightsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Generate insights based on data
    const generateInsights = () => {
        const insights = []
        const activeGoals = goals.filter((g: any) => !g.is_archived && !g.is_completed)
        const completedGoals = goals.filter((g: any) => !g.is_archived && g.is_completed)
        const nearlyComplete = goals.filter((g: any) => 
            !g.is_archived && 
            !g.is_completed && 
            g.progress_percentage >= 80 && 
            g.progress_percentage < 100
        )

        // Safe balance insight
        if (summary.safe_balance > 0) {
            insights.push({
                id: 'safe_balance',
                type: 'positive',
                icon: 'mdi:shield-outline',
                title: 'Available to Save',
                description: `You have ${formatCurrency(summary.safe_balance)} in safe balance that can be allocated to savings.`,
            })
        } else if (summary.safe_balance === 0) {
            insights.push({
                id: 'no_safe_balance',
                type: 'warning',
                icon: 'mdi:alert-circle',
                title: 'No Available Funds',
                description: 'Your safe balance is empty. Add funds to start saving.',
            })
        }

        // Total saved insight
        if (summary.total_saved > 0) {
            insights.push({
                id: 'total_saved',
                type: 'positive',
                icon: 'mdi:bank',
                title: 'Total Savings',
                description: `You have saved ${formatCurrency(summary.total_saved)} across ${summary.active_goals + summary.completed_goals} goals.`,
            })
        }

        // Completed goals insight
        if (completedGoals.length > 0) {
            insights.push({
                id: 'completed_goals',
                type: 'positive',
                icon: 'mdi:check-circle',
                title: 'Goals Completed',
                description: `Congratulations! You've completed ${completedGoals.length} goal${completedGoals.length > 1 ? 's' : ''}. Keep it up!`,
            })
        }

        // Nearly complete goals insight
        if (nearlyComplete.length > 0) {
            insights.push({
                id: 'nearly_complete',
                type: 'warning',
                icon: 'mdi:alert',
                title: 'Almost There!',
                description: `${nearlyComplete.length} goal${nearlyComplete.length > 1 ? 's are' : ' is'} nearly complete (80%+). Push through to finish!`,
            })
        }

        // Active goals insight
        if (activeGoals.length === 0 && completedGoals.length === 0 && goals.length === 0) {
            insights.push({
                id: 'no_goals',
                type: 'neutral',
                icon: 'mdi:target',
                title: 'No Savings Goals',
                description: 'Create your first savings goal to start building your future.',
            })
        } else if (activeGoals.length === 0 && completedGoals.length > 0) {
            insights.push({
                id: 'all_completed',
                type: 'positive',
                icon: 'mdi:trophy',
                title: 'All Goals Completed! 🎉',
                description: 'You\'ve completed all your savings goals. Time to set new ones!',
            })
        }

        // Progress insight
        const totalTarget = goals
            .filter((g: any) => !g.is_archived)
            .reduce((sum: number, g: any) => sum + (g.target_amount || 0), 0)
        
        const totalSaved = goals
            .filter((g: any) => !g.is_archived)
            .reduce((sum: number, g: any) => sum + (g.current_amount || 0), 0)

        if (totalTarget > 0 && totalSaved > 0) {
            const percentage = (totalSaved / totalTarget) * 100
            if (percentage > 0 && percentage < 100) {
                insights.push({
                    id: 'overall_progress',
                    type: 'neutral',
                    icon: 'mdi:chart-line',
                    title: `Overall Progress: ${percentage.toFixed(0)}%`,
                    description: `You're making progress! ${formatCurrency(totalSaved)} saved of ${formatCurrency(totalTarget)} total target.`,
                })
            }
        }

        return insights
    }

    const insights = generateInsights()

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'positive':
                return {
                    bg: 'bg-[#5CB85C]/10',
                    border: 'border-[#5CB85C]/20',
                    text: 'text-[#5CB85C]',
                }
            case 'warning':
                return {
                    bg: 'bg-[#F59E0B]/10',
                    border: 'border-[#F59E0B]/20',
                    text: 'text-[#F59E0B]',
                }
            case 'neutral':
                return {
                    bg: 'bg-[#3B82F6]/10',
                    border: 'border-[#3B82F6]/20',
                    text: 'text-[#3B82F6]',
                }
            default:
                return {
                    bg: 'bg-[#1A1A1A]',
                    border: 'border-[#242424]',
                    text: 'text-[#9A9A9A]',
                }
        }
    }

    if (insights.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Insights</h3>
                <div className="text-center py-6">
                    <Icon icon="mdi:lightbulb-outline" className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
                    <p className="text-sm text-[#9A9A9A]">No insights available</p>
                    <p className="text-xs text-[#6B7280] mt-1">Start saving to get insights</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:lightbulb-outline" className="w-4 h-4 text-[#5CB85C]" />
                <h3 className="text-sm font-medium text-white">Insights</h3>
            </div>

            <div className="space-y-3">
                {insights.slice(0, 4).map((insight) => {
                    const styles = getTypeStyles(insight.type)
                    return (
                        <div
                            key={insight.id}
                            className={`p-3 rounded-lg ${styles.bg} border ${styles.border}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 mt-0.5 ${styles.text}`}>
                                    <Icon icon={insight.icon} className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium text-white`}>
                                        {insight.title}
                                    </p>
                                    <p className="text-xs text-[#9A9A9A] mt-0.5 leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Stats Footer */}
            {goals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#242424] grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="text-xs text-[#9A9A9A]">Active</p>
                        <p className="text-sm font-semibold text-white">{summary.active_goals}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-[#9A9A9A]">Completed</p>
                        <p className="text-sm font-semibold text-[#5CB85C]">{summary.completed_goals}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-[#9A9A9A]">Saved</p>
                        <p className="text-sm font-semibold text-white">{formatCurrency(summary.total_saved)}</p>
                    </div>
                </div>
            )}
        </div>
    )
}