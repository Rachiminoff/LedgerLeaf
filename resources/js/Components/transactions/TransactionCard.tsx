import React, { useState } from 'react'
import { Icon } from '@iconify/react'

interface TransactionCardProps {
    transaction: any
    onClick?: (transaction: any) => void
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
    transaction,
    onClick,
}) => {
    const [expanded, setExpanded] = useState(false)

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getActionBadgeColor = (action: string) => {
        const colors: Record<string, string> = {
            'create_pocket': 'bg-[#5CB85C]/20 text-[#5CB85C]',
            'update_pocket': 'bg-[#3B82F6]/20 text-[#3B82F6]',
            'archive_pocket': 'bg-[#F59E0B]/20 text-[#F59E0B]',
            'delete_pocket': 'bg-[#EF4444]/20 text-[#EF4444]',
            'restore_pocket': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'refund_pocket': 'bg-[#10B981]/20 text-[#10B981]',
            'allocate_funds': 'bg-[#5CB85C]/20 text-[#5CB85C]',
            'transfer_funds': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'create_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
            'update_expense': 'bg-[#3B82F6]/20 text-[#3B82F6]',
            'delete_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
            'archive_expense': 'bg-[#F59E0B]/20 text-[#F59E0B]',
            'restore_expense': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'deposit': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        }
        return colors[action] || 'bg-[#242424]/20 text-[#9A9A9A]'
    }

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            'create_pocket': 'Pocket Created',
            'update_pocket': 'Pocket Updated',
            'archive_pocket': 'Pocket Archived',
            'delete_pocket': 'Pocket Deleted',
            'restore_pocket': 'Pocket Restored',
            'refund_pocket': 'Pocket Refunded',
            'allocate_funds': 'Funds Allocated',
            'transfer_funds': 'Funds Transferred',
            'create_expense': 'Expense Created',
            'update_expense': 'Expense Updated',
            'delete_expense': 'Expense Deleted',
            'archive_expense': 'Expense Archived',
            'restore_expense': 'Expense Restored',
            'deposit': 'Fund Deposit',
        }
        return labels[action] || action
    }

    const hasChanges = transaction.old_values || transaction.new_values

    return (
        <div 
            className="bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-200 cursor-pointer"
            onClick={() => onClick?.(transaction)}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionBadgeColor(transaction.action)}`}>
                        <Icon icon="mdi:receipt-outline" className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getActionBadgeColor(transaction.action)}`}>
                            {getActionLabel(transaction.action)}
                        </span>
                        <p className="text-sm text-[#9A9A9A] mt-1 truncate">
                            {transaction.table_name || '—'}
                        </p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs text-[#9A9A9A]">{formatDate(transaction.created_at)}</p>
                    <p className="text-xs text-[#9A9A9A] font-mono">{transaction.ip_address || '—'}</p>
                </div>
            </div>

            {/* Changes Preview */}
            {hasChanges && (
                <div className="mt-3 pt-3 border-t border-[#242424]">
                    <div className="flex items-center gap-2 text-xs text-[#5CB85C]">
                        <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5" />
                        <span>Values changed</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setExpanded(!expanded)
                            }}
                            className="text-[#9A9A9A] hover:text-white"
                        >
                            <Icon icon={expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Expanded Details */}
            {expanded && hasChanges && (
                <div className="mt-3 pt-3 border-t border-[#242424]">
                    <div className="grid grid-cols-2 gap-3">
                        {transaction.old_values && (
                            <div>
                                <p className="text-xs font-medium text-[#9A9A9A] mb-1">Old Values</p>
                                <pre className="text-xs text-[#9A9A9A] bg-[#171717] p-2 rounded-lg overflow-x-auto max-h-24">
                                    {JSON.stringify(JSON.parse(transaction.old_values), null, 2)}
                                </pre>
                            </div>
                        )}
                        {transaction.new_values && (
                            <div>
                                <p className="text-xs font-medium text-[#9A9A9A] mb-1">New Values</p>
                                <pre className="text-xs text-[#9A9A9A] bg-[#171717] p-2 rounded-lg overflow-x-auto max-h-24">
                                    {JSON.stringify(JSON.parse(transaction.new_values), null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}