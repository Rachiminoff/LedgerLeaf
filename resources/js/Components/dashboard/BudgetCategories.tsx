import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { usePockets } from '@/hooks/usePockets'

interface Pocket {
  id: number
  name: string
  icon: string
  color: string
  allocated: number
  spent: number
  remaining: number
  progress?: number
  is_archived?: boolean
  description?: string
}

interface BudgetCategoriesProps {
  categories?: Pocket[]
  onManage?: () => void
  onViewPocket?: (id: number) => void
  limit?: number
}

export const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  categories: propCategories,
  onManage,
  onViewPocket,
  limit = 6,
}) => {
  const [localPockets, setLocalPockets] = useState<Pocket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use the hook to fetch pockets from database
  const { pockets: hookPockets, fetchPockets, loading: hookLoading } = usePockets()

  /**
   * Initialize pockets from props or fetch from API
   */
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setLocalPockets(propCategories)
      setLoading(false)
      setError(null)
    } else {
      fetchPockets()
    }
  }, [propCategories])

  /**
   * Update local pockets when hook data changes
   */
  useEffect(() => {
    if (!propCategories && hookPockets) {
      const normalizedPockets: Pocket[] = hookPockets.map((pocket: any) => {
        const allocated = Number(pocket.allocated || 0)
        const spent = Number(pocket.spent || 0)
        const remaining = allocated - spent
        const progress = allocated > 0 ? (spent / allocated) * 100 : 0
        
        return {
          id: pocket.id,
          name: pocket.name,
          icon: pocket.icon || 'mdi:folder',
          color: pocket.color || '#5CB85C',
          allocated: allocated,
          spent: spent,
          remaining: remaining,
          progress: progress,
          is_archived: pocket.is_archived || false,
          description: pocket.description || '',
        }
      })
      setLocalPockets(normalizedPockets)
      setLoading(false)
      setError(null)
    }
  }, [hookPockets, propCategories])

  /**
   * Update loading state from hook
   */
  useEffect(() => {
    if (!propCategories) {
      setLoading(hookLoading)
    }
  }, [hookLoading, propCategories])

  /**
   * Format amount as Philippine Peso currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Refresh pockets from database
   */
  const refreshPockets = async () => {
    setError(null)
    try {
      await fetchPockets()
    } catch (err) {
      setError('Failed to load pockets')
      console.error('Error fetching pockets:', err)
    }
  }

  // Filter only active pockets (not archived)
  const activePockets = localPockets.filter(p => !p.is_archived)
  
  // Sort pockets by progress (most urgent first)
  const sortedPockets = [...activePockets].sort((a, b) => {
    const aProgress = a.progress || 0
    const bProgress = b.progress || 0
    // Sort by progress descending (most spent first)
    return bProgress - aProgress
  })

  // Limit the number of pockets shown
  const displayedPockets = sortedPockets.slice(0, limit)

  /**
   * Loading skeleton placeholder
   */
  if (loading) {
    return (
      <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-[#242424] rounded animate-pulse" />
          <div className="h-4 w-16 bg-[#242424] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-xl p-4 border border-[#242424]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#242424] animate-pulse" />
                  <div>
                    <div className="h-4 w-20 bg-[#242424] rounded animate-pulse" />
                    <div className="h-3 w-16 bg-[#242424] rounded animate-pulse mt-1" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-[#242424] rounded animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 w-12 bg-[#242424] rounded animate-pulse" />
                  <div className="h-3 w-16 bg-[#242424] rounded animate-pulse" />
                </div>
                <div className="h-1.5 bg-[#242424] rounded-full animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-[#242424] rounded animate-pulse" />
                  <div className="h-3 w-16 bg-[#242424] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-3 text-[#FF5A5A]">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-[#FF5A5A]">{error}</p>
          <button
            onClick={refreshPockets}
            className="mt-3 text-sm text-[#5CB85C] hover:text-[#6FCF70] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-white">Budget Pockets</h3>
          <span className="text-xs text-[#9A9A9A] bg-[#1A1A1A] px-2 py-0.5 rounded-full">
            {activePockets.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPockets}
            className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200"
            title="Refresh pockets"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
          </button>
          <button
            onClick={onManage}
            className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Empty State */}
      {activePockets.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 text-[#9A9A9A]">
            <Icon icon="mdi:wallet-outline" className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-[#9A9A9A]">No pockets yet</p>
          <p className="text-xs text-[#6B7280] mt-1">Create a pocket to start budgeting</p>
          <button 
            onClick={onManage}
            className="text-sm text-[#5CB85C] hover:text-[#6FCF70] transition-colors mt-3"
          >
            Create your first pocket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedPockets.map((pocket) => {
            const percentage = Math.min(Math.round(pocket.progress || 0), 100)
            const isOverBudget = percentage > 100
            const isNearLimit = percentage > 80 && percentage <= 100
            const remaining = pocket.allocated - pocket.spent

            /**
             * Determines the status color based on budget health
             */
            const getStatusColor = () => {
              if (isOverBudget) return '#FF5A5A'
              if (isNearLimit) return '#FFB74D'
              return pocket.color || '#5CB85C'
            }

            const statusColor = getStatusColor()

            return (
              <div
                key={pocket.id}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-[#242424] hover:border-[#5CB85C] transition-all duration-200 group cursor-pointer"
                onClick={() => onViewPocket?.(pocket.id)}
              >
                {/* Pocket Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${pocket.color}20` }}
                    >
                      <Icon 
                        icon={pocket.icon || 'mdi:folder'} 
                        className="h-4 w-4" 
                        style={{ color: pocket.color }} 
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-white truncate block">
                        {pocket.name}
                      </span>
                      <span className="text-[10px] text-[#9A9A9A] truncate block">
                        {formatCurrency(pocket.allocated)} allocated
                      </span>
                    </div>
                  </div>
                  {/* Progress Percentage */}
                  <span className={`text-xs font-medium flex-shrink-0 ml-2 ${
                    isOverBudget ? 'text-[#FF5A5A]' : isNearLimit ? 'text-[#FFB74D]' : 'text-[#9A9A9A]'
                  }`}>
                    {isOverBudget ? 'Over Budget' : `${percentage}%`}
                  </span>
                </div>

                {/* Budget Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9A9A9A]">Spent</span>
                    <span className="text-white">{formatCurrency(pocket.spent)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9A9A9A]">Remaining</span>
                    <span className={isOverBudget ? 'text-[#FF5A5A]' : 'text-white'}>
                      {isOverBudget 
                        ? `-${formatCurrency(Math.abs(remaining))}` 
                        : formatCurrency(remaining)
                      }
                    </span>
                  </div>
                </div>

                {/* Budget Health Indicator */}
                <div className="mt-2 pt-2 border-t border-[#242424] flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-[10px] text-[#9A9A9A]">
                    {isOverBudget 
                      ? 'Over budget' 
                      : isNearLimit 
                        ? 'Near limit' 
                        : 'On track'
                    }
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View All Link */}
      {activePockets.length > limit && (
        <div className="mt-4 text-center">
          <button 
            onClick={onManage}
            className="text-sm text-[#5CB85C] hover:text-[#6FCF70] transition-colors"
          >
            View all {activePockets.length} pockets
          </button>
        </div>
      )}
    </div>
  )
}

export default BudgetCategories