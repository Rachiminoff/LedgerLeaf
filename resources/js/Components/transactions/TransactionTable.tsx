import React, { useState } from 'react'
import { Icon } from '@iconify/react'

interface TransactionTableProps {
    transactions: any[]
    onRowClick?: (transaction: any) => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    onRowClick,
}) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null)

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

    const getActionIcon = (action: string) => {
        const icons: Record<string, string> = {
            'create_pocket': 'mdi:plus-circle',
            'update_pocket': 'mdi:pencil',
            'archive_pocket': 'mdi:archive',
            'delete_pocket': 'mdi:delete',
            'restore_pocket': 'mdi:restore',
            'refund_pocket': 'mdi:currency-usd',
            'allocate_funds': 'mdi:arrow-right',
            'transfer_funds': 'mdi:swap-horizontal',
            'create_expense': 'mdi:minus-circle',
            'update_expense': 'mdi:pencil',
            'delete_expense': 'mdi:delete',
            'archive_expense': 'mdi:archive',
            'restore_expense': 'mdi:restore',
            'deposit': 'mdi:plus',
        }
        return icons[action] || 'mdi:circle'
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

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id)
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
                <Icon icon="mdi:receipt-outline" className="w-12 h-12 text-[#9A9A9A] mx-auto mb-3" />
                <p className="text-sm text-[#9A9A9A]">No transactions found</p>
                <p className="text-xs text-[#6B7280] mt-1">Try adjusting your filters</p>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#242424]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Table
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Changes
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                IP Address
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                        {transactions.map((transaction) => {
                            const isExpanded = expandedRow === transaction.id
                            const hasChanges = transaction.old_values || transaction.new_values

                            return (
                                <React.Fragment key={transaction.id}>
                                    <tr 
                                        className="hover:bg-[#171717] transition-colors cursor-pointer"
                                        onClick={() => onRowClick?.(transaction)}
                                    >
                                        <td className="px-4 py-3 text-sm text-[#9A9A9A] whitespace-nowrap">
                                            {formatDate(transaction.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${getActionBadgeColor(transaction.action)}`}>
                                                <Icon icon={getActionIcon(transaction.action)} className="w-3.5 h-3.5" />
                                                {getActionLabel(transaction.action)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#9A9A9A]">
                                            <span className="px-2 py-0.5 rounded bg-[#242424] text-xs">
                                                {transaction.table_name || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#9A9A9A] max-w-[200px] truncate">
                                            {hasChanges ? (
                                                <span className="flex items-center gap-1 text-[#5CB85C]">
                                                    <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5" />
                                                    Values changed
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#9A9A9A] font-mono">
                                            {transaction.ip_address || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleRow(transaction.id)
                                                }}
                                                className="p-1 rounded hover:bg-[#242424] transition-colors"
                                            >
                                                <Icon 
                                                    icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
                                                    className="w-4 h-4 text-[#9A9A9A]" 
                                                />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Row */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-4 bg-[#0A0A0A]">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {transaction.old_values && (
                                                        <div>
                                                            <p className="text-xs font-medium text-[#9A9A9A] mb-1">Old Values</p>
                                                            <pre className="text-xs text-[#9A9A9A] bg-[#171717] p-3 rounded-lg overflow-x-auto max-h-32">
                                                                {JSON.stringify(JSON.parse(transaction.old_values), null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    {transaction.new_values && (
                                                        <div>
                                                            <p className="text-xs font-medium text-[#9A9A9A] mb-1">New Values</p>
                                                            <pre className="text-xs text-[#9A9A9A] bg-[#171717] p-3 rounded-lg overflow-x-auto max-h-32">
                                                                {JSON.stringify(JSON.parse(transaction.new_values), null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    {!transaction.old_values && !transaction.new_values && (
                                                        <div className="col-span-2 text-center text-[#9A9A9A] text-sm py-4">
                                                            No detailed change data available
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}