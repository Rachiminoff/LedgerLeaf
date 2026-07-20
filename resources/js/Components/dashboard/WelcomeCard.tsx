import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'

interface WelcomeCardProps {
  user?: {
    id?: number
    name?: string
    email?: string
    avatar?: string | null
    email_verified_at?: string | null
    created_at?: string
  }
  totalBalance?: number
  safeBalance?: number
  currency?: string
  greeting?: string
  message?: string
  onTransfer?: () => void
  onViewTransactions?: () => void
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  user = {},
  totalBalance = 0,
  safeBalance = 0,
  currency = '₱',
  greeting = 'Good Morning',
  message = "Let's make today productive.",
  onViewTransactions,
}) => {
  const [showBalance, setShowBalance] = useState(true)
  const [timeGradient, setTimeGradient] = useState('')
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      '#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784',
      '#FFB74D', '#FFA726', '#FF9800', '#F57C00',
      '#FF5252', '#FF6B6B', '#FF8A80',
      '#6C5CE7', '#A29BFE', '#81C784',
      '#4FC3F7', '#29B6F6', '#0288D1',
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  const getTimeBasedGradient = () => {
    const hour = new Date().getHours()
    
    // Dawn (5:00 - 6:59)
    if (hour >= 5 && hour < 7) {
      return 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]'
    }
    // Morning (7:00 - 11:59)
    if (hour >= 7 && hour < 12) {
      return 'from-[#0f0f1a] via-[#1a1a2e] to-[#2d2d44]'
    }
    // Afternoon (12:00 - 16:59)
    if (hour >= 12 && hour < 17) {
      return 'from-[#0d0d1a] via-[#1a1a2e] to-[#2a2a4a]'
    }
    // Evening (17:00 - 19:59)
    if (hour >= 17 && hour < 20) {
      return 'from-[#0d0d1a] via-[#1a1a2e] to-[#3d1f2e]'
    }
    // Night (20:00 - 4:59)
    return 'from-[#08080f] via-[#0d0d1a] to-[#1a0a1a]'
  }

  const getTimeIcon = () => {
    const hour = new Date().getHours()
    
    // Dawn
    if (hour >= 5 && hour < 7) {
      return 'mdi:weather-sunset-up'
    }
    // Morning
    if (hour >= 7 && hour < 12) {
      return 'mdi:weather-sunny'
    }
    // Afternoon
    if (hour >= 12 && hour < 17) {
      return 'mdi:weather-partly-cloudy'
    }
    // Evening
    if (hour >= 17 && hour < 20) {
      return 'mdi:weather-sunset-down'
    }
    // Night
    return 'mdi:weather-night'
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 7) return 'Dawn'
    if (hour >= 7 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 20) return 'Evening'
    return 'Night'
  }

  const getMemberSince = () => {
    if (!user?.created_at) return ''
    const date = new Date(user.created_at)
    return date.toLocaleDateString('en-PH', {
      month: 'long',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('PHP', currency)
  }

  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  const handleAddFunds = () => {
    router.visit('/add-funds')
  }

  useEffect(() => {
    setTimeGradient(getTimeBasedGradient())
  }, [])

  const avatarColor = getAvatarColor(userName)
  const timeIcon = getTimeIcon()
  const timeGreeting = getTimeGreeting()

  return (
    <div className={`bg-gradient-to-br ${timeGradient} rounded-2xl border border-[#242424] p-6 sm:p-8 relative overflow-hidden group transition-all duration-1000`}>
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5CB85C]/10 via-transparent to-[#5CB85C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Decorative Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5CB85C]/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative Branch - Subtle background */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
          <path d="M180 20C160 40 140 60 150 80C160 100 180 90 190 70C200 50 190 30 170 20C150 10 120 20 100 40C80 60 60 80 40 70C20 60 10 40 20 30" 
                stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M150 80C145 95 135 105 125 110" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M100 40C90 25 80 15 70 20" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="125" cy="110" r="4" fill="#5CB85C" opacity="0.4"/>
          <circle cx="70" cy="20" r="4" fill="#5CB85C" opacity="0.4"/>
          <circle cx="40" cy="70" r="3" fill="#5CB85C" opacity="0.4"/>
          <circle cx="20" cy="30" r="3" fill="#5CB85C" opacity="0.4"/>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar with ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#5CB85C]/20 blur-md animate-pulse" />
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#5CB85C]/30"
              style={{ backgroundColor: `${avatarColor}15` }}
            >
              <span className="text-xl sm:text-2xl font-medium" style={{ color: avatarColor }}>
                {getInitials(userName)}
              </span>
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Icon icon={timeIcon} className="w-4 h-4 text-[#5CB85C]" />
                <p className="text-sm font-light text-white/80">{timeGreeting}</p>
              </div>
              {user?.email_verified_at && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#5CB85C]/10 text-[#5CB85C] border border-[#5CB85C]/20">
                  <Icon icon="mdi:check-circle" className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">{userName}</h2>
            <p className="text-xs text-[#5CB85C] font-light mt-0.5">{message}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-[#9A9A9A] font-light truncate">{userEmail}</p>
              {getMemberSince() && (
                <>
                  <span className="text-[10px] text-[#9A9A9A]">•</span>
                  <p className="text-[10px] text-[#9A9A9A] font-light flex items-center gap-1">
                    <Icon icon="mdi:calendar" className="w-3 h-3" />
                    Member since {getMemberSince()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <p className="text-sm text-[#9A9A9A] font-light">Total Balance</p>
            <button
              onClick={toggleBalance}
              className="text-[#9A9A9A] hover:text-white transition-all duration-200 hover:scale-110"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              <Icon
                icon={showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                className="h-4 w-4"
              />
            </button>
          </div>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            {showBalance ? formatCurrency(totalBalance) : '••••••'}
          </p>
        </div>

        {/* Safe Balance */}
        <div className="mb-6 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 hover:border-[#5CB85C]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#5CB85C]/10">
                <Icon icon="mdi:shield-outline" className="w-4 h-4 text-[#5CB85C]" />
              </div>
              <div>
                <p className="text-xs text-[#9A9A9A] font-light">Safe Balance</p>
                <p className="text-[10px] text-[#5CB85C] font-light">
                  Unallocated funds
                </p>
              </div>
            </div>
            <p className="text-xl font-light text-white">
              {showBalance ? formatCurrency(safeBalance) : '••••••'}
            </p>
          </div>
          {safeBalance > 0 && totalBalance > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-[#9A9A9A] mb-1">
                <span>Available</span>
                <span>{Math.round((safeBalance / totalBalance) * 100)}% of total</span>
              </div>
              <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#5CB85C] to-[#70C970]"
                  style={{
                    width: `${Math.min((safeBalance / totalBalance) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {[
            { 
              label: 'Add Funds', 
              icon: 'mdi:plus-circle-outline', 
              color: '#5CB85C',
              bgHover: 'hover:bg-[#5CB85C]/10',
              borderHover: 'hover:border-[#5CB85C]',
              onClick: handleAddFunds,
            },
            { 
              label: 'Transactions', 
              icon: 'mdi:receipt-outline', 
              color: '#4FC3F7',
              bgHover: 'hover:bg-[#4FC3F7]/10',
              borderHover: 'hover:border-[#4FC3F7]',
              onClick: onViewTransactions,
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-[#242424] text-sm font-medium transition-all duration-300 ${action.bgHover} ${action.borderHover} hover:scale-[1.02] active:scale-[0.98]`}
              style={{ color: action.color }}
            >
              <Icon icon={action.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}