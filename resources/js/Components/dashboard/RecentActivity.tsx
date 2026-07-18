import React from 'react'
import { Icon } from '@iconify/react'

interface Activity {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category_name: string
  category_icon?: string
  category_color?: string
  date: string
  created_at: string
  budget_name?: string | null
  pocket_name?: string | null
}

interface RecentActivityProps {
  activities: Activity[]
  onViewAll?: () => void
  onItemClick?: (id: number) => void
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onViewAll,
  onItemClick,
}) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-[#5CB85C]'
      case 'expense': return 'text-[#FF5A5A]'
      default: return 'text-[#9A9A9A]'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'income': return 'mdi:arrow-down'
      case 'expense': return 'mdi:arrow-up'
      default: return 'mdi:swap-horizontal'
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-[#5CB85C]/10'
      case 'expense': return 'bg-[#FF5A5A]/10'
      default: return 'bg-[#9A9A9A]/10'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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

  const getAmountDisplay = (activity: Activity) => {
    const sign = activity.type === 'income' ? '+' : '-'
    return `${sign}${formatCurrency(activity.amount)}`
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-white">Recent Activity</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200"
          >
            View All
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Icon icon="mdi:receipt-outline" className="h-8 w-8 text-[#242424] mx-auto mb-2" />
          <p className="text-sm text-[#9A9A9A] font-light">No recent activity</p>
          <p className="text-xs text-[#9A9A9A] font-light">Start tracking your transactions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              onClick={() => onItemClick?.(activity.id)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1A1A1A] transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgColor(activity.type)}`}>
                  <Icon
                    icon={activity.category_icon || getIcon(activity.type)}
                    className={`h-4 w-4 ${getColor(activity.type)}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.description}
                    </p>
                    {activity.budget_name && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#242424] text-[#9A9A9A] truncate max-w-[80px]">
                        {activity.budget_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                    <span>{activity.category_name}</span>
                    <span>•</span>
                    <span>{formatDate(activity.created_at)}</span>
                    {activity.pocket_name && (
                      <>
                        <span>•</span>
                        <span className="text-[#5CB85C]">{activity.pocket_name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium flex-shrink-0 ml-4 ${getColor(activity.type)}`}>
                {getAmountDisplay(activity)}
              </span>
            </div>
          ))}
          {activities.length > 5 && (
            <button
              onClick={onViewAll}
              className="w-full text-center text-xs text-[#9A9A9A] hover:text-white transition-colors duration-200 py-2 mt-2"
            >
              View all {activities.length} transactions
            </button>
          )}
        </div>
      )}
    </div>
  )
}