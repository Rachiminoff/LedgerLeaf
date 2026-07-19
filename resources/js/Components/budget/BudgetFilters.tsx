// resources/js/Components/budget/BudgetFilters.tsx
import { Search, Filter, X } from 'lucide-react';

interface BudgetFiltersProps {
    filters: any;
    onFilterChange: (filters: any) => void;
    onReset: () => void;
}

export default function BudgetFilters({ filters, onFilterChange, onReset }: BudgetFiltersProps) {
    const statusOptions = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived' },
        { value: 'over_budget', label: 'Over Budget' },
        { value: 'under_budget', label: 'Under Budget' },
    ];

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'allocated', label: 'Allocated' },
        { value: 'spent', label: 'Spent' },
        { value: 'remaining', label: 'Remaining' },
        { value: 'progress', label: 'Progress' },
    ];

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                        <input
                            type="text"
                            placeholder="Search pockets..."
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

                <select
                    value={filters.status || 'all'}
                    onChange={(e) => onFilterChange({ status: e.target.value })}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.sort_by || 'name'}
                    onChange={(e) => onFilterChange({ sort_by: e.target.value })}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            Sort by {option.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onFilterChange({ sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' })}
                    className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] hover:border-[#5CB85C] transition-colors text-sm"
                >
                    {filters.sort_order === 'asc' ? '↑' : '↓'}
                </button>

                <button
                    onClick={onReset}
                    className="px-3 py-2 text-sm text-[#9A9A9A] hover:text-white border border-[#242424] rounded-lg hover:border-[#5CB85C] transition-colors flex items-center gap-1.5"
                >
                    <X className="w-3.5 h-3.5" />
                    Clear
                </button>
            </div>
        </div>
    );
}