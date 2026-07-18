import React from 'react'
import { Icon } from '@iconify/react'

interface Stat {
  id: number
  title: string
  value: string
  icon: string
  trend: string
  trendUp: boolean
  source?: string
  rawValue?: number
}

interface StatsGridProps {
  stats: Stat[]
  onStatClick?: (id: number) => void
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, onStatClick }) => {
  const getTrendColor = (trendUp: boolean, value: string) => {
    if (value === '0' || value === 'N/A') return 'text-[#9A9A9A]'
    return trendUp ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'
  }

  const getTrendIcon = (trendUp: boolean, value: string) => {
    if (value === '0' || value === 'N/A') return 'mdi:minus'
    return trendUp ? 'mdi:arrow-up' : 'mdi:arrow-down'
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => onStatClick?.(stat.id)}
          className={`bg-[#111111] rounded-2xl border border-[#242424] p-4 sm:p-5 transition-all duration-200 hover:border-[#5CB85C] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#5CB85C]/5 ${onStatClick ? 'cursor-pointer' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#5CB85C]/10 transition-colors duration-200">
              <Icon icon={stat.icon} className="h-4 w-4 text-[#5CB85C]" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(stat.trendUp, stat.trend)}`}>
              <Icon icon={getTrendIcon(stat.trendUp, stat.trend)} className="h-3 w-3" />
              <span>{stat.trend}</span>
            </div>
          </div>
          <p className="text-xs text-[#9A9A9A] font-light">{stat.title}</p>
          <p className="text-lg sm:text-xl font-light text-white mt-0.5">{stat.value}</p>
          {stat.source && (
            <p className="text-[10px] text-[#9A9A9A] mt-1 font-light">{stat.source}</p>
          )}
        </div>
      ))}
    </div>
  )
}