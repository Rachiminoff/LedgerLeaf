import React from 'react'
import { Icon } from '@iconify/react'

interface SavingsHistoryProps {
    transactions: any[]
}

export default function SavingsHistory({ transactions }: SavingsHistoryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Recent Activity</h3>
                <div className="text-center py-6">
                    <Icon icon="mdi:clock-outline" className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
                    <p className="text-sm text-[#9A9A9A]">No savings activity yet</p>
                    <p className="text-xs text-[#6B7280] mt-1">Start saving towards your goals</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => {
                    const isDeposit = transaction.type === 'deposit'
                    return (
                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-[#242424] last:border-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-1.5 rounded-lg ${isDeposit ? 'bg-[#5CB85C]/10' : 'bg-[#F59E0B]/10'}`}>
                                    <Icon 
                                        icon={isDeposit ? 'mdi:arrow-up' : 'mdi:arrow-down'} 
                                        className={`w-3.5 h-3.5 ${isDeposit ? 'text-[#5CB85C]' : 'text-[#F59E0B]'}`}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-white truncate">
                                        {transaction.savings_goal?.name || 'Unknown Goal'}
                                    </p>
                                    <p className="text-xs text-[#9A9A9A]">
                                        {formatDate(transaction.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                                <p className={`text-sm font-medium ${isDeposit ? 'text-[#5CB85C]' : 'text-[#F59E0B]'}`}>
                                    {isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-[#9A9A9A] capitalize">{transaction.type}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}