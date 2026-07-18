import React from 'react'
import { Icon } from '@iconify/react'

interface TimelineItem {
  id: number
  action: string
  table_name: string | null
  record_id: number | null
  created_at: string
  old_values: any
  new_values: any
}

interface ActivityTimelineProps {
  timeline: TimelineItem[]
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ timeline }) => {
  const getEventIcon = (action: string) => {
    const icons: Record<string, string> = {
      'login': 'mdi:login',
      'create': 'mdi:plus-circle',
      'update': 'mdi:pencil',
      'delete': 'mdi:delete',
      'logout': 'mdi:logout',
    }
    return icons[action] || 'mdi:circle'
  }

  const getEventColor = (action: string) => {
    const colors: Record<string, string> = {
      'login': 'text-[#5CB85C]',
      'create': 'text-[#5CB85C]',
      'update': 'text-[#FFB74D]',
      'delete': 'text-[#FF5252]',
      'logout': 'text-[#9E9E9E]',
    }
    return colors[action] || 'text-[#9E9E9E]'
  }

  const getEventDisplay = (item: TimelineItem) => {
    const actions: Record<string, string> = {
      'login': 'Logged in',
      'create': `Created ${item.table_name?.replace('_', ' ') || 'record'}`,
      'update': `Updated ${item.table_name?.replace('_', ' ') || 'record'}`,
      'delete': `Deleted ${item.table_name?.replace('_', ' ') || 'record'}`,
      'logout': 'Logged out',
    }
    return actions[item.action] || item.action
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
      <h3 className="text-sm font-medium text-white mb-4">Activity Timeline</h3>
      <div className="space-y-4">
        {timeline.length === 0 ? (
          <p className="text-sm text-[#9A9A9A] text-center py-4">No activity yet</p>
        ) : (
          timeline.map((item, index) => (
            <div key={item.id} className="relative pl-6">
              {index < timeline.length - 1 && (
                <div className="absolute left-2 top-5 bottom-0 w-px bg-[#242424]" />
              )}
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${getEventColor(item.action)}`} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon icon={getEventIcon(item.action)} className={`h-3 w-3 ${getEventColor(item.action)}`} />
                    <p className="text-sm font-medium text-white truncate">
                      {getEventDisplay(item)}
                    </p>
                  </div>
                  {item.old_values && (
                    <p className="text-xs text-[#9A9A9A] mt-0.5 truncate">
                      {item.action === 'update' ? 'Changed: ' : ''}
                      {item.action === 'update' ? item.old_values : ''}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-[#9A9A9A] flex-shrink-0">
                  {formatDate(item.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}