import React from 'react'
import { Icon } from '@iconify/react'

interface Insight {
  id: number
  message: string
  icon: string
  type: 'positive' | 'warning' | 'neutral'
  source?: 'notification' | 'audit' | 'system'
  created_at?: string
}

interface InsightsPanelProps {
  insights: Insight[]
  onViewAll?: () => void
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  onViewAll,
}) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-[#5CB85C]'
      case 'warning': return 'text-[#FFB74D]'
      default: return 'text-[#9A9A9A]'
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-[#5CB85C]/20'
      case 'warning': return 'border-[#FFB74D]/20'
      default: return 'border-[#242424]'
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-[#5CB85C]/5'
      case 'warning': return 'bg-[#FFB74D]/5'
      default: return 'bg-[#1A1A1A]'
    }
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Insights</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-[#9A9A9A] hover:text-white transition-colors duration-200"
          >
            View All
          </button>
        )}
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-6">
          <Icon icon="mdi:lightbulb-outline" className="h-8 w-8 text-[#242424] mx-auto mb-2" />
          <p className="text-sm text-[#9A9A9A] font-light">No insights yet</p>
          <p className="text-xs text-[#9A9A9A] font-light">Start tracking your finances to get insights</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 p-3 rounded-xl ${getBgColor(insight.type)} border ${getBorderColor(insight.type)} transition-all duration-200 hover:border-[#5CB85C] group`}
            >
              <Icon
                icon={insight.icon}
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${getColor(insight.type)} group-hover:scale-110 transition-transform duration-200`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#9A9A9A] font-light leading-relaxed">
                  {insight.message}
                </p>
                {insight.created_at && (
                  <p className="text-[10px] text-[#9A9A9A] mt-1">
                    {new Date(insight.created_at).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
                {insight.source && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getBgColor(insight.type)} ${getColor(insight.type)} mt-1 inline-block`}>
                    {insight.source}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}