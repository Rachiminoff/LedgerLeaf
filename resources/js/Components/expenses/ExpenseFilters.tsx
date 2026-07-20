import { useState, useEffect } from 'react';
import { Filter, Search, X, ChevronDown, RefreshCw } from 'lucide-react';
import { usePockets } from '@/hooks/usePockets';

interface ExpenseFiltersProps {
    filters: any;
    onFilterChange: (filters: any) => void;
    onReset: () => void;
}

export default function ExpenseFilters({ filters, onFilterChange, onReset }: ExpenseFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { pockets, fetchPockets, loading: pocketsLoading } = usePockets();

    useEffect(() => {
        fetchPockets();
    }, []);

    const dateRanges = [
        { value: 'today', label: 'Today' },
        { value: 'this_week', label: 'This Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_3_months', label: 'Last 3 Months' },
        { value: 'custom', label: 'Custom' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'highest', label: 'Highest Amount' },
        { value: 'lowest', label: 'Lowest Amount' },
    ];

    const paymentMethods = [
        'Cash',
        'Credit Card',
        'Debit Card',
        'Bank Transfer',
        'GCash',
        'PayMaya',
        'Other',
    ];

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl mb-6">
            {/* Filter Bar */}
            <div className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range Quick Select */}
                    <div className="flex flex-wrap gap-2">
                        {dateRanges.slice(0, 4).map((range) => (
                            <button
                                key={range.value}
                                onClick={() => onFilterChange({ date_range: range.value })}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    filters.date_range === range.value
                                        ? 'bg-[#5CB85C] text-white'
                                        : 'bg-[#171717] text-[#9A9A9A] hover:text-white hover:border-[#5CB85C]'
                                } border border-transparent hover:border-[#5CB85C]`}
                            >
                                {range.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-[#171717] text-[#9A9A9A] hover:text-white border border-[#242424] hover:border-[#5CB85C] transition-colors flex items-center gap-1.5"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            More
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={filters.search || ''}
                                onChange={(e) => onFilterChange({ search: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => onFilterChange({ search: '' })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={filters.sort_by || 'newest'}
                            onChange={(e) => onFilterChange({ sort_by: e.target.value })}
                            className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm appearance-none cursor-pointer pr-8"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A] pointer-events-none" />
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={onReset}
                        className="px-3 py-2 text-sm text-[#9A9A9A] hover:text-white border border-[#242424] rounded-lg hover:border-[#5CB85C] transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Clear
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="border-t border-[#242424] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pocket Filter */}
                    <div>
                        <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                            Pocket
                        </label>
                        <select
                            value={filters.pocket_id || ''}
                            onChange={(e) => onFilterChange({ pocket_id: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                            disabled={pocketsLoading}
                        >
                            <option value="">All Pockets</option>
                            {pockets.map((pocket: any) => (
                                <option key={pocket.id} value={pocket.id}>
                                    {pocket.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                            Payment Method
                        </label>
                        <select
                            value={filters.payment_method || ''}
                            onChange={(e) => onFilterChange({ payment_method: e.target.value || undefined })}
                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                        >
                            <option value="">All Methods</option>
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom Date Range */}
                    {filters.date_range === 'custom' && (
                        <div className="grid grid-cols-2 gap-2 col-span-1 sm:col-span-2">
                            <div>
                                <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                                    From
                                </label>
                                <input
                                    type="date"
                                    value={filters.start_date || ''}
                                    onChange={(e) => onFilterChange({ start_date: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                                    To
                                </label>
                                <input
                                    type="date"
                                    value={filters.end_date || ''}
                                    onChange={(e) => onFilterChange({ end_date: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* Amount Range */}
                    <div className="grid grid-cols-2 gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                        <div>
                            <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                                Min Amount
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={filters.min_amount || ''}
                                onChange={(e) => onFilterChange({ min_amount: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5">
                                Max Amount
                            </label>
                            <input
                                type="number"
                                placeholder="1000.00"
                                value={filters.max_amount || ''}
                                onChange={(e) => onFilterChange({ max_amount: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Tags */}
            {(filters.pocket_id || filters.payment_method || filters.search) && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                    {filters.pocket_id && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Pocket: {pockets.find((p: any) => p.id === filters.pocket_id)?.name || 'Unknown'}
                            <button onClick={() => onFilterChange({ pocket_id: undefined })}>
                                <X className="w-3 h-3 hover:text-white" />
                            </button>
                        </span>
                    )}
                    {filters.payment_method && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            {filters.payment_method}
                            <button onClick={() => onFilterChange({ payment_method: undefined })}>
                                <X className="w-3 h-3 hover:text-white" />
                            </button>
                        </span>
                    )}
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
                            Search: {filters.search}
                            <button onClick={() => onFilterChange({ search: '' })}>
                                <X className="w-3 h-3 hover:text-white" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}