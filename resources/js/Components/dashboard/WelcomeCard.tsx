import React, { useState } from 'react'
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
  onTransfer,
  onViewTransactions,
}) => {
  const [showBalance, setShowBalance] = useState(true)
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
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

  const dynamicGreeting = greeting === 'Good Morning' ? getGreeting() : greeting
  const avatarColor = getAvatarColor(userName)

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative Branch - Subtle background */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <img
          src="/assets/images/branch.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar - Iconify only */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 border border-[#242424]"
            style={{ backgroundColor: `${avatarColor}20` }}
          >
            <Icon
              icon="mdi:account-circle"
              className="w-10 h-10 sm:w-12 sm:h-12"
              style={{ color: avatarColor }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-[#9A9A9A] font-light">{dynamicGreeting}</p>
              {user?.email_verified_at && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#5CB85C]/10 text-[#5CB85C] border border-[#5CB85C]/20">
                  Verified
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-white truncate">{userName}</h2>
            <p className="text-xs text-[#5CB85C] font-light mt-0.5">{message}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-[#9A9A9A] font-light truncate">{userEmail}</p>
              {getMemberSince() && (
                <>
                  <span className="text-[10px] text-[#9A9A9A]">•</span>
                  <p className="text-[10px] text-[#9A9A9A] font-light">
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
              className="text-[#9A9A9A] hover:text-white transition-colors duration-200"
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
        <div className="mb-6 p-4 rounded-xl bg-[#1A1A1A] border border-[#242424]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9A9A9A] font-light">Safe Balance</p>
              <p className="text-xs text-[#5CB85C] font-light mt-0.5">
                Money not allocated to pockets
              </p>
            </div>
            <p className="text-xl font-light text-white">
              {showBalance ? formatCurrency(safeBalance) : '••••••'}
            </p>
          </div>
          {safeBalance > 0 && (
            <div className="mt-2">
              <div className="w-full h-1 bg-[#242424] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((safeBalance / totalBalance) * 100, 100)}%`,
                    backgroundColor: '#5CB85C',
                  }}
                />
              </div>
              <p className="text-[10px] text-[#9A9A9A] mt-1">
                {totalBalance > 0 ? Math.round((safeBalance / totalBalance) * 100) : 0}% of total balance
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {[
            { 
              label: 'Add Funds', 
              icon: 'mdi:plus-circle-outline', 
              color: '#5CB85C',
              onClick: handleAddFunds,
            },
            { 
              label: 'Transfer', 
              icon: 'mdi:swap-horizontal', 
              color: '#9A9A9A',
              onClick: onTransfer,
            },
            { 
              label: 'View Transactions', 
              icon: 'mdi:receipt-outline', 
              color: '#9A9A9A',
              onClick: onViewTransactions,
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-[#242424] text-sm font-medium transition-all duration-200 hover:border-[#5CB85C] hover:bg-[#5CB85C]/5`}
              style={{ color: action.color }}
            >
              <Icon icon={action.icon} className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}