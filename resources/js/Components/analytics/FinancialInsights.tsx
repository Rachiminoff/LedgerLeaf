import React from 'react'
import { Icon } from '@iconify/react'

interface FinancialInsightsProps {
    insights: Array<{
        id: string
        type: 'positive' | 'warning' | 'neutral'
        title: string
        description: string
    }>
}

export default function FinancialInsights({ insights }: FinancialInsightsProps) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'positive':
                return {
                    bg: 'bg-[#5CB85C]/10',
                    border: 'border-[#5CB85C]/20',
                    icon: 'mdi:check-circle',
                    color: '#5CB85C',
                }
            case 'warning':
                return {
                    bg: 'bg-[#F59E0B]/10',
                    border: 'border-[#F59E0B]/20',
                    icon: 'mdi:alert',
                    color: '#F59E0B',
                }
            default:
                return {
                    bg: 'bg-[#3B82F6]/10',
                    border: 'border-[#3B82F6]/20',
                    icon: 'mdi:information',
                    color: '#3B82F6',
                }
        }
    }

    if (!insights || insights.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Icon icon="mdi:lightbulb-outline" className="w-4 h-4 text-[#5CB85C]" />
                    <h3 className="text-sm font-medium text-white">Financial Insights</h3>
                </div>
                <div className="text-center py-6">
                    <Icon icon="mdi:lightbulb-outline" className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
                    <p className="text-sm text-[#9A9A9A]">No insights available</p>
                    <p className="text-xs text-[#6B7280] mt-1">Continue using LedgerLeaf to generate insights</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:lightbulb-outline" className="w-4 h-4 text-[#5CB85C]" />
                <h3 className="text-sm font-medium text-white">Financial Insights</h3>
            </div>

            <div className="space-y-3">
                {insights.map((insight) => {
                    const styles = getTypeStyles(insight.type)
                    return (
                        <div
                            key={insight.id}
                            className={`p-3 rounded-lg ${styles.bg} border ${styles.border}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 mt-0.5 ${styles.color}`}>
                                    <Icon icon={styles.icon} className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{insight.title}</p>
                                    <p className="text-xs text-[#9A9A9A] mt-0.5 leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}