import React from 'react'
import { Icon } from '@iconify/react'

interface TransactionFiltersProps {
    filters: {
        search?: string
        action?: string
        table_name?: string
        date_range?: string
        sort_by?: string
    }
    onFilterChange: (filters: any) => void
    onApply: () => void
    onReset: () => void
    loading?: boolean
}

const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'create_pocket', label: 'Create Pocket' },
    { value: 'update_pocket', label: 'Update Pocket' },
    { value: 'archive_pocket', label: 'Archive Pocket' },
    { value: 'delete_pocket', label: 'Delete Pocket' },
    { value: 'restore_pocket', label: 'Restore Pocket' },
    { value: 'refund_pocket', label: 'Refund Pocket' },
    { value: 'allocate_funds', label: 'Allocate Funds' },
    { value: 'transfer_funds', label: 'Transfer Funds' },
    { value: 'create_expense', label: 'Create Expense' },
    { value: 'update_expense', label: 'Update Expense' },
    { value: 'delete_expense', label: 'Delete Expense' },
    { value: 'archive_expense', label: 'Archive Expense' },
    { value: 'restore_expense', label: 'Restore Expense' },
]

const tableOptions = [
    { value: '', label: 'All Tables' },
    { value: 'users', label: 'Users' },
    { value: 'pockets', label: 'Pockets' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'allocations', label: 'Allocations' },
]

const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
]

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
]

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
    filters,
    onFilterChange,
    onApply,
    onReset,
    loading = false,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onApply()
        }
    }

    const activeFilterCount = () => {
        let count = 0
        if (filters.search) count++
        if (filters.action) count++
        if (filters.table_name) count++
        if (filters.date_range && filters.date_range !== 'this_month') count++
        if (filters.sort_by && filters.sort_by !== 'newest') count++
        return count
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                        <Icon 
                            icon="mdi:magnify" 
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" 
                        />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={filters.search || ''}
                            onChange={(e) => onFilterChange({ search: e.target.value })}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Action Filter */}
                <select
                    value={filters.action || ''}
                    onChange={(e) => onFilterChange({ action: e.target.value })}
                    disabled={loading}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                    {actionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Table Filter */}
                <select
                    value={filters.table_name || ''}
                    onChange={(e) => onFilterChange({ table_name: e.target.value })}
                    disabled={loading}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                    {tableOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Date Range */}
                <select
                    value={filters.date_range || 'this_month'}
                    onChange={(e) => onFilterChange({ date_range: e.target.value })}
                    disabled={loading}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                    {dateRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Sort By */}
                <select
                    value={filters.sort_by || 'newest'}
                    onChange={(e) => onFilterChange({ sort_by: e.target.value })}
                    disabled={loading}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onApply}
                        disabled={loading}
                        className="px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Applying...
                            </span>
                        ) : (
                            'Apply Filters'
                        )}
                    </button>
                    <button
                        onClick={onReset}
                        disabled={loading}
                        className="px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors text-sm disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount() > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#242424]">
                    <span className="text-xs text-[#9A9A9A]">Active filters:</span>
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Search: {filters.search}
                            <button
                                onClick={() => onFilterChange({ search: '' })}
                                className="hover:text-white"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.action && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Action: {actionOptions.find(o => o.value === filters.action)?.label}
                            <button
                                onClick={() => onFilterChange({ action: '' })}
                                className="hover:text-white"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.table_name && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Table: {tableOptions.find(o => o.value === filters.table_name)?.label}
                            <button
                                onClick={() => onFilterChange({ table_name: '' })}
                                className="hover:text-white"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.date_range && filters.date_range !== 'this_month' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Date: {dateRangeOptions.find(o => o.value === filters.date_range)?.label}
                            <button
                                onClick={() => onFilterChange({ date_range: 'this_month' })}
                                className="hover:text-white"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}