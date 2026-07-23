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
  loading?: boolean
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, onStatClick, loading }) => {
  const getTrendColor = (trendUp: boolean, value: string) => {
    if (value === '0' || value === 'N/A') return 'text-[#9A9A9A]'
    return trendUp ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'
  }

  const getTrendIcon = (trendUp: boolean, value: string) => {
    if (value === '0' || value === 'N/A') return 'mdi:minus'
    return trendUp ? 'mdi:arrow-up' : 'mdi:arrow-down'
  }

  /**
   * Format the stat value - rounds percentages and formats numbers
   */
  const formatStatValue = (value: string, title: string) => {
    // If it's a percentage value (contains %), round it
    if (value.includes('%') && title.includes('Health')) {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        return `${Math.round(num)}%`
      }
    }
    
    // If it's a currency value (starts with ₱), keep as is
    if (value.startsWith('₱')) {
      return value
    }
    
    // If it's just a number, format it
    const num = parseFloat(value)
    if (!isNaN(num) && !value.includes('%') && !value.startsWith('₱')) {
      return num.toLocaleString()
    }
    
    return value
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-[#111111] rounded-2xl border border-[#242424] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] animate-pulse" />
              <div className="w-12 h-4 bg-[#1A1A1A] rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-[#1A1A1A] rounded animate-pulse mb-1" />
            <div className="h-6 w-20 bg-[#1A1A1A] rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
      {stats.map((stat) => {
        const formattedValue = formatStatValue(stat.value, stat.title)
        const isBudgetHealth = stat.title.toLowerCase().includes('health')
        
        return (
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
            <p className={`text-lg sm:text-xl font-light text-white mt-0.5 ${isBudgetHealth ? 'text-[#5CB85C]' : ''}`}>
              {formattedValue}
            </p>
            {stat.source && (
              <p className="text-[10px] text-[#9A9A9A] mt-1 font-light">{stat.source}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StatsGrid