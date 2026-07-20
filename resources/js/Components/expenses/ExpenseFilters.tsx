import { useState, useEffect, useCallback } from 'react';
import { Filter, Search, X, ChevronDown, RefreshCw } from 'lucide-react';
import { usePockets } from '@/hooks/usePockets';

// Define proper types for filters
export interface ExpenseFiltersType {
  date_range?: 'today' | 'this_week' | 'this_month' | 'last_3_months' | 'custom';
  search?: string;
  sort_by?: 'newest' | 'oldest' | 'highest' | 'lowest';
  pocket_id?: number;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFilterChange: (filters: Partial<ExpenseFiltersType>) => void;
  onReset: () => void;
}

// Define pocket type
interface Pocket {
  id: number;
  name: string;
  [key: string]: any; // For any additional properties
}

// Define payment method type
type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'GCash' | 'PayMaya' | 'Other';

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'GCash',
  'PayMaya',
  'Other',
];

const DATE_RANGES = [
  { value: 'today' as const, label: 'Today' },
  { value: 'this_week' as const, label: 'This Week' },
  { value: 'this_month' as const, label: 'This Month' },
  { value: 'last_3_months' as const, label: 'Last 3 Months' },
  { value: 'custom' as const, label: 'Custom' },
];

const SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest' },
  { value: 'oldest' as const, label: 'Oldest' },
  { value: 'highest' as const, label: 'Highest Amount' },
  { value: 'lowest' as const, label: 'Lowest Amount' },
];

export default function ExpenseFilters({ filters, onFilterChange, onReset }: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pockets, fetchPockets, loading: pocketsLoading } = usePockets();

  // Fetch pockets on mount with proper dependency
  useEffect(() => {
    const loadPockets = async () => {
      try {
        await fetchPockets();
      } catch (error) {
        console.error('Failed to load pockets:', error);
      }
    };
    loadPockets();
  }, [fetchPockets]);

  // Handle filter change with partial updates
  const handleFilterChange = useCallback((newFilters: Partial<ExpenseFiltersType>) => {
    onFilterChange(newFilters);
  }, [onFilterChange]);

  // Handle clearing a specific filter
  const clearFilter = useCallback((key: keyof ExpenseFiltersType) => {
    onFilterChange({ [key]: undefined });
  }, [onFilterChange]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.pocket_id || 
    filters.payment_method || 
    filters.search ||
    filters.min_amount ||
    filters.max_amount ||
    filters.start_date ||
    filters.end_date
  );

  // Get pocket name by ID
  const getPocketName = useCallback((id?: number): string => {
    if (!id) return 'Unknown';
    const pocket = pockets.find((p: Pocket) => p.id === id);
    return pocket?.name || 'Unknown';
  }, [pockets]);

  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl mb-6">
      {/* Filter Bar */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Quick Select */}
          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.slice(0, 4).map((range) => (
              <button
                key={range.value}
                onClick={() => handleFilterChange({ date_range: range.value })}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filters.date_range === range.value
                    ? 'bg-[#5CB85C] text-white'
                    : 'bg-[#171717] text-[#9A9A9A] hover:text-white hover:border-[#5CB85C]'
                } border border-transparent hover:border-[#5CB85C]`}
                aria-label={`Filter by ${range.label}`}
              >
                {range.label}
              </button>
            ))}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-sm rounded-lg bg-[#171717] text-[#9A9A9A] hover:text-white border border-[#242424] hover:border-[#5CB85C] transition-colors flex items-center gap-1.5"
              aria-expanded={isExpanded}
              aria-label="Toggle advanced filters"
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
                onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
                className="w-full pl-9 pr-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                aria-label="Search expenses"
              />
              {filters.search && (
                <button
                  onClick={() => clearFilter('search')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
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
              onChange={(e) => handleFilterChange({ sort_by: e.target.value as ExpenseFiltersType['sort_by'] })}
              className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm appearance-none cursor-pointer pr-8"
              aria-label="Sort expenses"
            >
              {SORT_OPTIONS.map((option) => (
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
            aria-label="Reset all filters"
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
            <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="pocket-filter">
              Pocket
            </label>
            <select
              id="pocket-filter"
              value={filters.pocket_id || ''}
              onChange={(e) => handleFilterChange({ pocket_id: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
              disabled={pocketsLoading}
            >
              <option value="">All Pockets</option>
              {pockets.map((pocket: Pocket) => (
                <option key={pocket.id} value={pocket.id}>
                  {pocket.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="payment-method-filter">
              Payment Method
            </label>
            <select
              id="payment-method-filter"
              value={filters.payment_method || ''}
              onChange={(e) => handleFilterChange({ payment_method: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
            >
              <option value="">All Methods</option>
              {PAYMENT_METHODS.map((method) => (
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
                <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="start-date">
                  From
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={filters.start_date || ''}
                  onChange={(e) => handleFilterChange({ start_date: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="end-date">
                  To
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={filters.end_date || ''}
                  onChange={(e) => handleFilterChange({ end_date: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                />
              </div>
            </div>
          )}

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <div>
              <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="min-amount">
                Min Amount
              </label>
              <input
                id="min-amount"
                type="number"
                placeholder="0.00"
                value={filters.min_amount ?? ''}
                onChange={(e) => handleFilterChange({ min_amount: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                min={0}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-xs text-[#9A9A9A] font-medium uppercase tracking-wider mb-1.5" htmlFor="max-amount">
                Max Amount
              </label>
              <input
                id="max-amount"
                type="number"
                placeholder="1000.00"
                value={filters.max_amount ?? ''}
                onChange={(e) => handleFilterChange({ max_amount: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                min={0}
                step={0.01}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-4">
          {filters.pocket_id && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              Pocket: {getPocketName(filters.pocket_id)}
              <button 
                onClick={() => clearFilter('pocket_id')}
                aria-label="Clear pocket filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.payment_method && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              {filters.payment_method}
              <button 
                onClick={() => clearFilter('payment_method')}
                aria-label="Clear payment method filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              Search: {filters.search}
              <button 
                onClick={() => clearFilter('search')}
                aria-label="Clear search filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.min_amount !== undefined && filters.min_amount !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              Min: ₱{filters.min_amount}
              <button 
                onClick={() => clearFilter('min_amount')}
                aria-label="Clear minimum amount filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.max_amount !== undefined && filters.max_amount !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              Max: ₱{filters.max_amount}
              <button 
                onClick={() => clearFilter('max_amount')}
                aria-label="Clear maximum amount filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.start_date && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              From: {filters.start_date}
              <button 
                onClick={() => clearFilter('start_date')}
                aria-label="Clear start date filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
          {filters.end_date && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#171717] rounded-full text-xs text-[#9A9A9A]">
              To: {filters.end_date}
              <button 
                onClick={() => clearFilter('end_date')}
                aria-label="Clear end date filter"
              >
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}