import React from 'react'
import { Icon } from '@iconify/react'

interface Notification {
  id: number
  type: string
  title: string
  message: string
  is_read: boolean
  link?: string | null
  read_at?: string | null
  created_at: string
}

interface NotificationsWidgetProps {
  notifications: Notification[]
  onMarkAsRead?: (id: number) => void
  onMarkAllAsRead?: () => void
  onViewAll?: () => void
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
}) => {
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'budget_alert': 'mdi:alert-circle',
      'goal_update': 'mdi:target',
      'system': 'mdi:information',
      'transaction': 'mdi:receipt',
      'approval': 'mdi:check-circle',
      'reminder': 'mdi:bell-ring',
    }
    return icons[type] || 'mdi:bell'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'budget_alert': 'text-[#FFB74D]',
      'goal_update': 'text-[#5CB85C]',
      'system': 'text-[#4FC3F7]',
      'transaction': 'text-[#81C784]',
      'approval': 'text-[#5CB85C]',
      'reminder': 'text-[#FFB74D]',
    }
    return colors[type] || 'text-[#9A9A9A]'
  }

  const getTypeBgColor = (type: string) => {
    const colors: Record<string, string> = {
      'budget_alert': 'bg-[#FFB74D]/10 border-[#FFB74D]/20',
      'goal_update': 'bg-[#5CB85C]/10 border-[#5CB85C]/20',
      'system': 'bg-[#4FC3F7]/10 border-[#4FC3F7]/20',
      'transaction': 'bg-[#81C784]/10 border-[#81C784]/20',
      'approval': 'bg-[#5CB85C]/10 border-[#5CB85C]/20',
      'reminder': 'bg-[#FFB74D]/10 border-[#FFB74D]/20',
    }
    return colors[type] || 'bg-[#1A1A1A] border-[#242424]'
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

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#5CB85C] text-black font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-[#9A9A9A] hover:text-[#5CB85C] transition-colors duration-200"
            >
              Mark all read
            </button>
          )}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-[#9A9A9A] hover:text-white transition-colors duration-200"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-6">
          <Icon icon="mdi:bell-off" className="h-8 w-8 text-[#242424] mx-auto mb-2" />
          <p className="text-sm text-[#9A9A9A] font-light">No notifications</p>
          <p className="text-xs text-[#9A9A9A] font-light">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-[#5CB85C]/5 ${
                !notification.is_read
                  ? `${getTypeBgColor(notification.type)}`
                  : 'bg-[#1A1A1A] border-[#242424]'
              }`}
              onClick={() => onMarkAsRead?.(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon
                    icon={getTypeIcon(notification.type)}
                    className={`h-4 w-4 ${getTypeColor(notification.type)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-[#9A9A9A] flex-shrink-0">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9A9A] mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  {!notification.is_read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5CB85C] mt-1.5" />
                  )}
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="text-[10px] text-[#5CB85C] hover:text-[#6FCF70] transition-colors mt-1 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {notifications.length > 5 && (
            <button
              onClick={onViewAll}
              className="w-full text-center text-xs text-[#9A9A9A] hover:text-white transition-colors duration-200 py-2"
            >
              View all {notifications.length} notifications
            </button>
          )}
        </div>
      )}
    </div>
  )
}