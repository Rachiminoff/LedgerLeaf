import React from 'react'
import { Icon } from '@iconify/react'

interface Activity {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  date: string
  created_at: string
  pocket_name?: string | null
}

interface RecentActivityProps {
  activities: Activity[]
  onViewAll?: () => void
  onItemClick?: (id: number) => void
  title?: string
  maxItems?: number
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onViewAll,
  onItemClick,
  title = 'Recent Activity',
  maxItems = 5,
}) => {
  /**
   * Returns the text color based on transaction type
   * Income = green, Expense = red, Transfer = gray
   */
  const getColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-[#5CB85C]'
      case 'expense': return 'text-[#FF5A5A]'
      default: return 'text-[#9A9A9A]'
    }
  }

  /**
   * Returns the appropriate icon for the transaction type
   * Income = downward trend (money coming in)
   * Expense = upward trend (money going out)
   * Transfer = horizontal swap
   */
  const getIcon = (type: string) => {
    switch (type) {
      case 'income': return 'mdi:trending-down'
      case 'expense': return 'mdi:trending-up'
      default: return 'mdi:swap-horizontal'
    }
  }

  /**
   * Returns the background color for the icon container
   * Uses low opacity version of the transaction color
   */
  const getBgColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-[#5CB85C]/10'
      case 'expense': return 'bg-[#FF5A5A]/10'
      default: return 'bg-[#9A9A9A]/10'
    }
  }

  /**
   * Returns the badge color for the status dot indicator
   */
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-[#5CB85C]'
      case 'expense': return 'bg-[#FF5A5A]'
      default: return 'bg-[#9A9A9A]'
    }
  }

  /**
   * Returns the label text for the transaction type
   * Income = "deposit", Expense = "spent", Transfer = "transfer"
   */
  const getLabel = (type: string) => {
    switch (type) {
      case 'income': return 'deposit'
      case 'expense': return 'spent'
      default: return 'transfer'
    }
  }

  /**
   * Returns the badge label for the transaction type
   * Income = "Deposit", Expense = "Expense", Transfer = "Transfer"
   */
  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'income': return 'Deposit'
      case 'expense': return 'Expense'
      default: return 'Transfer'
    }
  }

  /**
   * Formats a number as Philippine Peso currency
   * Removes decimal places for cleaner display
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
   * Formats a date string into a human-readable relative time
   * Examples: "Just now", "5m ago", "2h ago", "3d ago", "Jan 15"
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * Formats the amount with the appropriate sign
   * Income = positive sign with green color
   * Expense = negative sign with red color
   */
  const getAmountDisplay = (activity: Activity) => {
    if (activity.type === 'income') {
      return `+${formatCurrency(activity.amount)}`
    }
    return `-${formatCurrency(activity.amount)}`
  }

  // Sort activities by date (newest first)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const displayActivities = sortedActivities.slice(0, maxItems)

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#5CB85C]/10">
            <Icon icon="mdi:clock-outline" className="h-4 w-4 text-[#5CB85C]" />
          </div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {activities.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#242424] text-[#9A9A9A]">
              {activities.length}
            </span>
          )}
        </div>
        {onViewAll && activities.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-xs text-[#9A9A9A] hover:text-white transition-all duration-200 hover:scale-105 flex items-center gap-1"
          >
            View All
            <Icon icon="mdi:chevron-right" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-3">
            <Icon icon="mdi:receipt-outline" className="h-6 w-6 text-[#9A9A9A]" />
          </div>
          <p className="text-sm text-[#9A9A9A] font-light">No recent activity</p>
          <p className="text-xs text-[#9A9A9A] font-light mt-1">Start tracking your transactions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayActivities.map((activity, index) => {
            const isIncome = activity.type === 'income'
            
            return (
              <div
                key={activity.id}
                onClick={() => onItemClick?.(activity.id)}
                className="relative flex items-center justify-between p-3 rounded-xl hover:bg-[#1A1A1A] transition-all duration-200 group cursor-pointer"
              >
                {/* Timeline connector line between items */}
                {index < displayActivities.length - 1 && (
                  <div className="absolute left-[21px] top-[52px] w-[2px] h-[calc(100%-24px)] bg-gradient-to-b from-[#242424] to-transparent" />
                )}

                {/* Left side - Icon and details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon container with status dot */}
                  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(activity.type)}`}>
                    <Icon
                      icon={getIcon(activity.type)}
                      className={`h-5 w-5 ${getColor(activity.type)}`}
                    />
                    {/* Small status indicator dot */}
                    <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111111] ${getBadgeColor(activity.type)}`} />
                  </div>

                  {/* Transaction details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.description}
                      </p>
                      {/* Type badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isIncome 
                          ? 'bg-[#5CB85C]/20 text-[#5CB85C] border-[#5CB85C]/30' 
                          : 'bg-[#FF5A5A]/20 text-[#FF5A5A] border-[#FF5A5A]/30'
                      }`}>
                        {getBadgeLabel(activity.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                      {/* Timestamp */}
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:clock-outline" className="h-3 w-3" />
                        {formatDate(activity.created_at)}
                      </span>
                      {/* Pocket name (if available) */}
                      {activity.pocket_name && (
                        <>
                          <span>•</span>
                          <span className="text-[#5CB85C] flex items-center gap-1">
                            <Icon icon="mdi:wallet" className="h-3 w-3" />
                            {activity.pocket_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className="flex flex-col items-end flex-shrink-0 ml-4">
                  <span className={`text-sm font-semibold ${isIncome ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'}`}>
                    {getAmountDisplay(activity)}
                  </span>
                  <span className="text-[10px] text-[#9A9A9A]">
                    {getLabel(activity.type)}
                  </span>
                </div>

                {/* Hover indicator - right arrow */}
                <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon icon="mdi:chevron-right" className="h-4 w-4 text-[#9A9A9A]" />
                </div>
              </div>
            )
          })}

          {/* View All button for remaining items */}
          {activities.length > maxItems && (
            <button
              onClick={onViewAll}
              className="w-full text-center text-xs text-[#9A9A9A] hover:text-white transition-colors duration-200 py-3 mt-2 border-t border-[#242424] flex items-center justify-center gap-2 group"
            >
              View all {activities.length} transactions
              <Icon icon="mdi:arrow-right" className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}