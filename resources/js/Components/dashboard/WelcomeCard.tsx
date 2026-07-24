import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'
import { AvatarModal } from '@/Components/ui/AvatarModal'

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

const STORAGE_KEY_STYLE = 'ledgerleaf_avatar_style'
const STORAGE_KEY_SEED = 'ledgerleaf_avatar_seed'

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  user = {},
  totalBalance = 0,
  safeBalance = 0,
  currency = '₱',
  message = "Let's make today productive.",
  onViewTransactions,
}) => {
  const [showBalance, setShowBalance] = useState(true)
  const [timeGradient, setTimeGradient] = useState('')
  const [displayBalance, setDisplayBalance] = useState(totalBalance)
  const [displaySafeBalance, setDisplaySafeBalance] = useState(safeBalance)
  const [progressWidth, setProgressWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [avatarStyle, setAvatarStyle] = useState<string>('shapes')
  const [avatarSeed, setAvatarSeed] = useState<string>(user?.name || 'User')
  const animationRef = useRef<number | null>(null)

  const userName = user?.name || 'User'

  // Load avatar preferences from localStorage
  useEffect(() => {
    const savedStyle = localStorage.getItem(STORAGE_KEY_STYLE)
    const savedSeed = localStorage.getItem(STORAGE_KEY_SEED)
    
    if (savedStyle) {
      setAvatarStyle(savedStyle)
    }
    if (savedSeed) {
      setAvatarSeed(savedSeed)
    } else {
      setAvatarSeed(userName)
    }
  }, [userName])

  // Memoize expensive calculations
  const initials = useMemo(() => {
    return userName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [userName])

  // Generate DiceBear avatar URL
  const avatarUrl = useMemo(() => {
    const encodedSeed = encodeURIComponent(avatarSeed)
    return `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodedSeed}&backgroundColor=transparent`
  }, [avatarStyle, avatarSeed])

  const avatarColor = useMemo(() => {
    const colors = [
      '#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784',
      '#FFB74D', '#FFA726', '#FF9800', '#F57C00',
      '#FF5252', '#FF6B6B', '#FF8A80',
      '#6C5CE7', '#A29BFE', '#81C784',
      '#4FC3F7', '#29B6F6', '#0288D1',
    ]
    const index = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }, [userName])

  const timeIcon = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 7) return 'mdi:weather-sunset-up'
    if (hour >= 7 && hour < 12) return 'mdi:weather-sunny'
    if (hour >= 12 && hour < 17) return 'mdi:weather-partly-cloudy'
    if (hour >= 17 && hour < 20) return 'mdi:weather-sunset-down'
    return 'mdi:weather-night'
  }, [])

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 7) return 'Dawn'
    if (hour >= 7 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 20) return 'Evening'
    return 'Night'
  }, [])

  const getTimeBasedGradient = useCallback(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 7) return 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]'
    if (hour >= 7 && hour < 12) return 'from-[#0f0f1a] via-[#1a1a2e] to-[#2d2d44]'
    if (hour >= 12 && hour < 17) return 'from-[#0d0d1a] via-[#1a1a2e] to-[#2a2a4a]'
    if (hour >= 17 && hour < 20) return 'from-[#0d0d1a] via-[#1a1a2e] to-[#3d1f2e]'
    return 'from-[#08080f] via-[#0d0d1a] to-[#1a0a1a]'
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('PHP', currency)
  }, [currency])

  const getMemberSince = useCallback(() => {
    if (!user?.created_at) return ''
    const date = new Date(user.created_at)
    return date.toLocaleDateString('en-PH', {
      month: 'long',
      year: 'numeric',
    })
  }, [user?.created_at])

  // Animate balance counting
  useEffect(() => {
    if (hasAnimated || totalBalance === undefined) return

    const duration = 900
    const startTime = Date.now()
    const startBalance = 0
    const endBalance = totalBalance
    const startSafeBalance = 0
    const endSafeBalance = safeBalance

    setDisplayBalance(0)
    setDisplaySafeBalance(0)
    setProgressWidth(0)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentBalance = startBalance + (endBalance - startBalance) * easeOut
      const currentSafeBalance = startSafeBalance + (endSafeBalance - startSafeBalance) * easeOut

      setDisplayBalance(currentBalance)
      setDisplaySafeBalance(currentSafeBalance)
      
      const progressWidthValue = endBalance > 0 
        ? Math.min((currentSafeBalance / endBalance) * 100, 100) 
        : 0
      setProgressWidth(progressWidthValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayBalance(endBalance)
        setDisplaySafeBalance(endSafeBalance)
        const finalProgress = endBalance > 0 
          ? Math.min((endSafeBalance / endBalance) * 100, 100) 
          : 0
        setProgressWidth(finalProgress)
        setHasAnimated(true)
      }
    }

    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [totalBalance, safeBalance, hasAnimated])

  useEffect(() => {
    setTimeGradient(getTimeBasedGradient())
  }, [getTimeBasedGradient])

  const toggleBalance = useCallback(() => {
    setShowBalance(!showBalance)
  }, [showBalance])

  const handleAddFunds = useCallback(() => {
    router.visit('/add-funds')
  }, [])

  const handleAvatarError = useCallback(() => {
    setAvatarError(true)
  }, [])

  const handleAvatarClick = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleAvatarSave = useCallback((style: string, seed: string) => {
    setAvatarStyle(style)
    setAvatarSeed(seed)
    localStorage.setItem(STORAGE_KEY_STYLE, style)
    localStorage.setItem(STORAGE_KEY_SEED, seed)
  }, [])

  const isPositive = totalBalance > 0
  const isSafePositive = safeBalance > 0
  const memberSince = getMemberSince()

  return (
    <>
      <div
        className={`bg-gradient-to-br ${timeGradient} rounded-2xl border border-[#242424] p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
          isHovered ? 'shadow-2xl shadow-[#5CB85C]/5 -translate-y-1 border-[#5CB85C]/30' : 'shadow-lg shadow-black/10'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: 'slideUpFade 0.6s ease-out forwards',
        }}
      >
        <style>{`
          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-slideUpFade {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>

        {/* Decorative Glow Effects - Subtle */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 bg-[#5CB85C]/5 rounded-full blur-3xl pointer-events-none transition-all duration-[8000ms] ease-in-out"
          style={{ 
            transform: isHovered ? 'scale(1.1) translateX(-10px)' : 'scale(1) translateX(0)',
          }}
        />

        <div className="relative z-10">
          {/* Compact Header - User Info */}
          <div className="flex items-center gap-3 mb-6">
            {/* Avatar */}
            <div 
              className="relative flex-shrink-0 cursor-pointer group/avatar"
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              aria-label="Customize avatar"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleAvatarClick()
                }
              }}
            >
              <div 
                className="absolute inset-0 rounded-full blur-md transition-all duration-500"
                style={{ 
                  backgroundColor: avatarColor,
                  opacity: isHovered ? 0.25 : 0.12,
                  animation: 'float 4s ease-in-out infinite'
                }}
              />
              <div
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 overflow-hidden"
                style={{ 
                  backgroundColor: `${avatarColor}15`,
                  borderColor: isHovered ? avatarColor : `${avatarColor}30`,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {!avatarError ? (
                  <>
                    <img
                      src={avatarUrl}
                      alt={`${userName}'s avatar`}
                      className="w-full h-full object-cover rounded-full"
                      onError={handleAvatarError}
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                      <div className="bg-[#5CB85C] rounded-full p-1 shadow-lg">
                        <Icon icon="mdi:camera-outline" className="w-3 h-3 text-black" />
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-lg sm:text-xl font-medium select-none" style={{ color: avatarColor }}>
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* User Info - Compact */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                  {userName}
                </h2>
                {user?.email_verified_at && (
                  <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-[#5CB85C]/10 text-[#5CB85C] border border-[#5CB85C]/20">
                    <Icon icon="mdi:check-circle" className="w-2.5 h-2.5" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Icon icon={timeIcon} className="w-3 h-3 text-[#5CB85C]" />
                  <p className="text-xs font-light text-white/50">{timeGreeting}</p>
                </div>
                <span className="text-[8px] text-[#6B7280]">•</span>
                <p className="text-[10px] text-[#6B7280] font-light">
                  {memberSince ? `Member since ${memberSince}` : 'Welcome'}
                </p>
              </div>
              <p className="text-xs text-[#5CB85C] font-light mt-0.5 opacity-50">
                {message}
              </p>
            </div>
          </div>

          {/* Hero Balance Section */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-medium text-[#9A9A9A] uppercase tracking-[0.12em]">
                Total Balance
              </p>
              <button
                onClick={toggleBalance}
                className="text-[#9A9A9A] hover:text-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] rounded-lg p-0.5"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                <Icon
                  icon={showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                  className="h-3.5 w-3.5"
                />
              </button>
              {isPositive && (
                <span className="text-[9px] text-[#5CB85C] bg-[#5CB85C]/10 px-2 py-0.5 rounded-full border border-[#5CB85C]/20">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-end gap-3">
              <p className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight transition-all duration-300">
                {showBalance ? formatCurrency(displayBalance) : '••••••'}
              </p>
            </div>
            {!isPositive && totalBalance === 0 && (
              <p className="text-xs text-[#9A9A9A] font-light mt-2 opacity-60 max-w-md">
                Start building your financial future — add funds to your account and take control of your finances.
              </p>
            )}
          </div>

          {/* Safe Balance - Simplified */}
          <div className="mb-5 p-3.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/5 hover:border-[#5CB85C]/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#5CB85C]/10">
                  <Icon icon="mdi:shield-outline" className="w-4 h-4 text-[#5CB85C]" />
                </div>
                <div>
                  <p className="text-xs text-[#9A9A9A] font-medium">Available to Allocate</p>
                  <p className="text-[9px] text-[#5CB85C] font-light opacity-60">
                    {isSafePositive 
                      ? 'Funds ready for budgeting' 
                      : safeBalance === 0 && totalBalance === 0 
                        ? 'Add funds to get started' 
                        : 'All funds are allocated'}
                  </p>
                </div>
              </div>
              <p className="text-lg font-light text-white transition-all duration-300">
                {showBalance ? formatCurrency(displaySafeBalance) : '••••••'}
              </p>
            </div>
            {totalBalance > 0 && (
              <div className="mt-2.5">
                <div className="flex justify-between text-[9px] text-[#9A9A9A] mb-1">
                  <span>Allocation</span>
                  <span className="text-[#5CB85C]">
                    {Math.round((safeBalance / totalBalance) * 100)}% available
                  </span>
                </div>
                <div className="w-full h-1 bg-[#242424]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#5CB85C] to-[#70C970]"
                    style={{
                      width: `${Math.min(progressWidth, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleAddFunds}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#5CB85C] text-black rounded-xl hover:bg-[#6FCF70] transition-all duration-200 font-medium text-sm hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#5CB85C]/20 hover:shadow-[#5CB85C]/30 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <Icon icon="mdi:plus-circle-outline" className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span>Add Funds</span>
            </button>
            <button
              onClick={onViewTransactions}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-[#242424] text-[#9A9A9A] rounded-xl hover:border-[#5CB85C] hover:text-white hover:bg-[#5CB85C]/5 transition-all duration-200 font-medium text-sm hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/30 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#5CB85C]/0 via-[#5CB85C]/5 to-[#5CB85C]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <Icon icon="mdi:receipt-outline" className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span>Transactions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStyle={avatarStyle}
        currentSeed={avatarSeed}
        userName={userName}
        onSave={handleAvatarSave}
      />
    </>
  )
}

export default WelcomeCard