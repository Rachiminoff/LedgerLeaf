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
  greeting = 'Good Morning',
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
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

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

  const getMemberSince = useCallback(() => {
    if (!user?.created_at) return ''
    const date = new Date(user.created_at)
    return date.toLocaleDateString('en-PH', {
      month: 'long',
      year: 'numeric',
    })
  }, [user?.created_at])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('PHP', currency)
  }, [currency])

  const getTodayDate = useCallback(() => {
    return new Date().toLocaleDateString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

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
  const todayDate = getTodayDate()

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-gradient-to-br ${timeGradient} rounded-2xl border border-[#242424] p-6 sm:p-8 relative overflow-hidden transition-all duration-500 ease-out ${
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
          @keyframes glowPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-slideUpFade {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
            .animate-float {
              animation: none !important;
            }
            .animate-glowPulse {
              animation: none !important;
            }
          }
        `}</style>

        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5CB85C]/10 via-transparent to-[#5CB85C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Decorative Glow Effects */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 bg-[#5CB85C]/5 rounded-full blur-3xl pointer-events-none transition-all duration-[8000ms] ease-in-out"
          style={{ 
            transform: isHovered ? 'scale(1.1) translateX(-10px)' : 'scale(1) translateX(0)',
            animation: 'glowPulse 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5CB85C]/3 rounded-full blur-3xl pointer-events-none transition-all duration-[10000ms] ease-in-out"
          style={{ 
            transform: isHovered ? 'scale(1.15) translateX(10px)' : 'scale(1) translateX(0)'
          }}
        />

        {/* Decorative Branch */}
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-5 pointer-events-none">
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
          {/* Header - User Info */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar with DiceBear image - Clickable */}
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
                className="absolute inset-0 rounded-full blur-md transition-all duration-700"
                style={{ 
                  backgroundColor: avatarColor,
                  opacity: isHovered ? 0.3 : 0.15,
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  animation: 'float 4s ease-in-out infinite'
                }}
              />
              <div
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 overflow-hidden group-hover/avatar:border-[#5CB85C] group-hover/avatar:scale-105 group-hover/avatar:shadow-lg group-hover/avatar:shadow-[#5CB85C]/20"
                style={{ 
                  backgroundColor: `${avatarColor}15`,
                  borderColor: isHovered ? avatarColor : `${avatarColor}40`,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered ? `0 0 30px ${avatarColor}20` : 'none'
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
                    {/* Camera icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                      <div className="bg-[#5CB85C] rounded-full p-1.5 shadow-lg">
                        <Icon icon="mdi:camera-outline" className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-medium select-none" style={{ color: avatarColor }}>
                    {initials}
                  </span>
                )}
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Icon icon={timeIcon} className="w-3.5 h-3.5 text-[#5CB85C]" />
                  <p className="text-xs font-light text-white/60">{timeGreeting}</p>
                </div>
                {user?.email_verified_at && (
                  <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-[#5CB85C]/10 text-[#5CB85C] border border-[#5CB85C]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#5CB85C]/40 hover:bg-[#5CB85C]/15">
                    <Icon icon="mdi:check-circle" className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white truncate tracking-tight">
                {userName}
              </h2>
              <p className="text-xs text-[#5CB85C] font-light mt-0.5 opacity-70">
                {message}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-xs text-[#9A9A9A] font-light truncate opacity-75">{userEmail}</p>
                {memberSince && (
                  <>
                    <span className="text-[10px] text-[#9A9A9A] opacity-40">•</span>
                    <p className="text-[10px] text-[#9A9A9A] font-light flex items-center gap-1 opacity-60">
                      <Icon icon="mdi:calendar" className="w-3 h-3" />
                      Member since {memberSince}
                    </p>
                  </>
                )}
              </div>
              <p className="text-[10px] text-[#6B7280] font-light mt-0.5 opacity-50">
                {todayDate}
              </p>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[10px] font-medium text-[#9A9A9A] uppercase tracking-[0.1em]">
                Total Balance
              </p>
              <button
                onClick={toggleBalance}
                className="text-[#9A9A9A] hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] rounded-lg p-0.5"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                <Icon
                  icon={showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                  className="h-4 w-4"
                />
              </button>
              {isPositive && (
                <span className="text-[10px] text-[#5CB85C] bg-[#5CB85C]/10 px-2.5 py-0.5 rounded-full border border-[#5CB85C]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#5CB85C]/40">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight transition-all duration-300">
                {showBalance ? formatCurrency(displayBalance) : '••••••'}
              </p>
            </div>
            {!isPositive && totalBalance === 0 && (
              <p className="text-xs text-[#9A9A9A] font-light mt-1 opacity-60">
                Start your financial journey by adding funds
              </p>
            )}
          </div>

          {/* Safe Balance */}
          <div className="mb-6 p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 hover:border-[#5CB85C]/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#5CB85C]/10 transition-all duration-300 group-hover:bg-[#5CB85C]/15">
                  <Icon icon="mdi:shield-outline" className="w-4 h-4 text-[#5CB85C]" />
                </div>
                <div>
                  <p className="text-xs text-[#9A9A9A] font-medium">Safe Balance</p>
                  <p className="text-[10px] text-[#5CB85C] font-light opacity-70">
                    {isSafePositive 
                      ? 'Available to allocate' 
                      : safeBalance === 0 && totalBalance === 0 
                        ? 'Add funds to start allocating' 
                        : safeBalance === 0 && totalBalance > 0 
                          ? 'All funds allocated to pockets' 
                          : 'No funds available'}
                  </p>
                </div>
              </div>
              <p className="text-xl font-light text-white transition-all duration-300">
                {showBalance ? formatCurrency(displaySafeBalance) : '••••••'}
              </p>
            </div>
            {totalBalance > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-[#9A9A9A] mb-1">
                  <span className="opacity-60">Available</span>
                  <span className="text-[#5CB85C] opacity-80">
                    {Math.round((safeBalance / totalBalance) * 100)}% of total
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#242424]/50 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#5CB85C] to-[#70C970] relative"
                    style={{
                      width: `${Math.min(progressWidth, 100)}%`,
                    }}
                  >
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-[#5CB85C] opacity-40 rounded-full blur-sm"
                      style={{
                        animation: progressWidth < 100 && progressWidth > 0 ? 'shimmer 1.5s ease-in-out infinite' : 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleAddFunds}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#5CB85C] text-black rounded-xl hover:bg-[#6FCF70] transition-all duration-300 font-medium text-sm hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#5CB85C]/20 hover:shadow-[#5CB85C]/40 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Icon icon="mdi:plus-circle-outline" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Add Funds</span>
            </button>
            <button
              onClick={onViewTransactions}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-[#242424] text-[#9A9A9A] rounded-xl hover:border-[#4FC3F7] hover:text-white hover:bg-[#4FC3F7]/10 transition-all duration-300 font-medium text-sm hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f1a] group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#4FC3F7]/0 via-[#4FC3F7]/5 to-[#4FC3F7]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Icon icon="mdi:receipt-outline" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
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