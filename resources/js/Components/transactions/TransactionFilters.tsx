import React, { useState } from 'react'
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
    { value: 'deduct_pocket', label: 'Deduct from Pocket' },
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
    { value: 'savings_goals', label: 'Savings Goals' },
    { value: 'budgets', label: 'Budgets' },
    { value: 'categories', label: 'Categories' },
]

const dateRangeOptions = [
    { value: '', label: 'All Time' },
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
    const [isExpanded, setIsExpanded] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onApply()
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        onFilterChange({ ...filters, [key]: value })
    }

    const activeFilterCount = () => {
        let count = 0
        if (filters.search && filters.search.trim() !== '') count++
        if (filters.action && filters.action !== '') count++
        if (filters.table_name && filters.table_name !== '') count++
        if (filters.date_range && filters.date_range !== '') count++
        if (filters.sort_by && filters.sort_by !== 'newest') count++
        return count
    }

    const getActionLabel = (value: string) => {
        const option = actionOptions.find(o => o.value === value)
        return option ? option.label : value
    }

    const getTableLabel = (value: string) => {
        const option = tableOptions.find(o => o.value === value)
        return option ? option.label : value
    }

    const getDateRangeLabel = (value: string) => {
        const option = dateRangeOptions.find(o => o.value === value)
        return option ? option.label : value
    }

    const filterCount = activeFilterCount()

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
            {/* Mobile: Search + Toggle + Apply/Reset */}
            <div className="flex flex-col gap-3">
                {/* Search and Action Row */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <Icon 
                                icon="mdi:magnify" 
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" 
                            />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={filters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Mobile: Action Buttons */}
                    <div className="flex items-center gap-1 md:hidden">
                        {/* Filter toggle button with badge */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="relative p-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] hover:border-[#5CB85C] transition-colors"
                            type="button"
                        >
                            <Icon icon="mdi:filter-variant" className="w-5 h-5" />
                            {filterCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#5CB85C] text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                    {filterCount}
                                </span>
                            )}
                        </button>
                        
                        <button
                            onClick={onApply}
                            disabled={loading}
                            className="px-3 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                            ) : (
                                'Apply'
                            )}
                        </button>
                        
                        <button
                            onClick={onReset}
                            disabled={loading}
                            className="p-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors disabled:opacity-50"
                        >
                            <Icon icon="mdi:refresh" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Desktop: All filters */}
                <div className="hidden md:flex md:flex-wrap md:items-center md:gap-3">
                    <select
                        value={filters.action || ''}
                        onChange={(e) => handleFilterChange('action', e.target.value)}
                        disabled={loading}
                        className="flex-1 min-w-[120px] px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {actionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.table_name || ''}
                        onChange={(e) => handleFilterChange('table_name', e.target.value)}
                        disabled={loading}
                        className="flex-1 min-w-[100px] px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {tableOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.date_range || ''}
                        onChange={(e) => handleFilterChange('date_range', e.target.value)}
                        disabled={loading}
                        className="flex-1 min-w-[110px] px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {dateRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.sort_by || 'newest'}
                        onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                        disabled={loading}
                        className="flex-1 min-w-[110px] px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onApply}
                            disabled={loading}
                            className="px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                                    Applying...
                                </span>
                            ) : (
                                'Apply Filters'
                            )}
                        </button>
                        <button
                            onClick={onReset}
                            disabled={loading}
                            className="px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Mobile Expanded Filters */}
                {isExpanded && (
                    <div className="md:hidden space-y-3 pt-3 border-t border-[#242424]">
                        <select
                            value={filters.action || ''}
                            onChange={(e) => handleFilterChange('action', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {actionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.table_name || ''}
                            onChange={(e) => handleFilterChange('table_name', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {tableOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.date_range || ''}
                            onChange={(e) => handleFilterChange('date_range', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {dateRangeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.sort_by || 'newest'}
                            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Mobile: Apply/Reset in expanded view */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={onApply}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                                        Applying...
                                    </span>
                                ) : (
                                    'Apply Filters'
                                )}
                            </button>
                            <button
                                onClick={onReset}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors text-sm disabled:opacity-50"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Filters - Always visible */}
            {filterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#242424]">
                    <span className="text-xs text-[#9A9A9A]">Active filters:</span>
                    {filters.search && filters.search.trim() !== '' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A] max-w-[150px]">
                            <Icon icon="mdi:search" className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{filters.search}</span>
                            <button
                                onClick={() => handleFilterChange('search', '')}
                                className="hover:text-white flex-shrink-0"
                                type="button"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.action && filters.action !== '' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            <Icon icon="mdi:tag" className="w-3 h-3" />
                            {getActionLabel(filters.action)}
                            <button
                                onClick={() => handleFilterChange('action', '')}
                                className="hover:text-white"
                                type="button"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.table_name && filters.table_name !== '' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            <Icon icon="mdi:table" className="w-3 h-3" />
                            {getTableLabel(filters.table_name)}
                            <button
                                onClick={() => handleFilterChange('table_name', '')}
                                className="hover:text-white"
                                type="button"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.date_range && filters.date_range !== '' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            <Icon icon="mdi:calendar" className="w-3 h-3" />
                            {getDateRangeLabel(filters.date_range)}
                            <button
                                onClick={() => handleFilterChange('date_range', '')}
                                className="hover:text-white"
                                type="button"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.sort_by && filters.sort_by !== 'newest' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            <Icon icon="mdi:sort" className="w-3 h-3" />
                            {sortOptions.find(o => o.value === filters.sort_by)?.label}
                            <button
                                onClick={() => handleFilterChange('sort_by', 'newest')}
                                className="hover:text-white"
                                type="button"
                            >
                                <Icon icon="mdi:close" className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    
                    {/* Clear all filters button */}
                    {filterCount > 1 && (
                        <button
                            onClick={onReset}
                            className="text-xs text-[#5CB85C] hover:text-[#6FCF70] transition-colors"
                            type="button"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}