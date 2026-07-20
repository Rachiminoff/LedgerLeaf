import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'

interface TopNavProps {
  title: string
  onMenuToggle?: () => void
  notificationCount?: number
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSearch?: (query: string) => void
  onNotificationsClick?: () => void
  showBackButton?: boolean
  onBack?: () => void
}

export const TopNav: React.FC<TopNavProps> = ({
  title,
  onMenuToggle,
  notificationCount = 0,
  user,
  onSearch,
  onNotificationsClick,
  showBackButton = false,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick()
    } else {
      router.visit('/notifications')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#242424]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left - Title & Menu */}
        <div className="flex items-center gap-4">
          {showBackButton && onBack ? (
            <button
              onClick={onBack}
              className="text-[#9A9A9A] hover:text-white transition-colors duration-200 p-2 -ml-2 min-h-[44px] min-w-[44px]"
              aria-label="Go back"
            >
              <Icon icon="mdi:arrow-left" className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-[#9A9A9A] hover:text-white transition-colors duration-200 p-2 -ml-2 min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
            >
              <Icon icon="mdi:menu" className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search - Desktop */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex items-center bg-[#1A1A1A] border rounded-xl px-3 py-2 transition-all duration-200 ${
              isSearchFocused ? 'border-[#5CB85C] ring-1 ring-[#5CB85C]/20' : 'border-[#242424]'
            }`}
          >
            <Icon icon="mdi:search" className="h-4 w-4 text-[#9A9A9A]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#9A9A9A] w-40 lg:w-56 ml-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#9A9A9A] hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Notifications */}
          <button
            onClick={handleNotificationsClick}
            className="relative text-[#9A9A9A] hover:text-white transition-colors duration-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Icon icon="mdi:bell-outline" className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF5A5A] rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}