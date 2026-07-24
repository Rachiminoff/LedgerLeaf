import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Icon } from '@iconify/react'

// ===== Types =====
interface AvatarStyle {
  id: string
  label: string
  icon: string
  description: string
  category: 'geometric' | 'character' | 'abstract' | 'minimal'
}

interface AvatarModalProps {
  isOpen: boolean
  onClose: () => void
  currentStyle: string
  currentSeed: string
  userName: string
  onSave: (style: string, seed: string) => void
}

// ===== Avatar Constants - Only Confirmed Working Styles =====
const AVATAR_STYLES: AvatarStyle[] = [
  // Geometric
  { id: 'shapes', label: 'Shapes', icon: 'mdi:hexagon-outline', description: 'Clean geometric shapes', category: 'geometric' },
  { id: 'rings', label: 'Rings', icon: 'mdi:circle-outline', description: 'Elegant ring designs', category: 'geometric' },
  { id: 'identicon', label: 'Identicon', icon: 'mdi:grid', description: 'Abstract grid patterns', category: 'geometric' },
  
  // Characters
  { id: 'initials', label: 'Initials', icon: 'mdi:format-letter-case', description: 'Styled initials', category: 'character' },
  { id: 'avataaars', label: 'Avataaars', icon: 'mdi:face-man', description: 'Cartoon character', category: 'character' },
  { id: 'personas', label: 'Persona', icon: 'mdi:account-circle', description: 'Minimal character', category: 'character' },
  
  // Abstract
  { id: 'glass', label: 'Glass', icon: 'mdi:glass-fragile', description: 'Modern glass style', category: 'abstract' },
  { id: 'big-ears', label: 'Big Ears', icon: 'mdi:ear-hearing', description: 'Character with big ears', category: 'abstract' },
  { id: 'big-smile', label: 'Big Smile', icon: 'mdi:emoticon-happy', description: 'Character with big smile', category: 'abstract' },
  { id: 'icons', label: 'Icons', icon: 'mdi:shape-outline', description: 'Simple icon style', category: 'abstract' },
  
  // Minimal
  { id: 'micah', label: 'Micah', icon: 'mdi:face-woman', description: 'Modern character style', category: 'minimal' },
  { id: 'thumbs', label: 'Thumbs', icon: 'mdi:hand-peace', description: 'Simple thumb style', category: 'minimal' },
  { id: 'croodles', label: 'Croodles', icon: 'mdi:brush-outline', description: 'Hand-drawn style', category: 'minimal' },
  { id: 'miniavs', label: 'Miniavs', icon: 'mdi:face', description: 'Tiny character style', category: 'minimal' },
]

// Category labels and icons
const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'mdi:view-grid-outline' },
  { id: 'geometric', label: 'Geometric', icon: 'mdi:hexagon-outline' },
  { id: 'character', label: 'Character', icon: 'mdi:account-outline' },
  { id: 'abstract', label: 'Abstract', icon: 'mdi:shape-outline' },
  { id: 'minimal', label: 'Minimal', icon: 'mdi:dots-horizontal' },
]

// DiceBear base URL
const DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x'

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  currentSeed,
  userName,
  onSave,
}) => {
  const [selectedStyle, setSelectedStyle] = useState(currentStyle)
  const [seed, setSeed] = useState(currentSeed)
  const [previewKey, setPreviewKey] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [failedStyles, setFailedStyles] = useState<Set<string>>(new Set())
  const modalRef = useRef<HTMLDivElement>(null)

  // Generate a random UUID
  const generateRandomSeed = useCallback(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }, [])

  // Get avatar URL with current style and seed
  const getAvatarUrl = useCallback((style: string, seedValue: string) => {
    const encodedSeed = encodeURIComponent(seedValue)
    return `${DICEBEAR_BASE_URL}/${style}/svg?seed=${encodedSeed}&backgroundColor=transparent`
  }, [])

  // Generate a set of preview avatars for carousel
  const getCarouselAvatars = useCallback((style: string, count: number = 6) => {
    const seeds = []
    for (let i = 0; i < count; i++) {
      seeds.push(generateRandomSeed())
    }
    return seeds.map(s => ({
      seed: s,
      url: getAvatarUrl(style, s)
    }))
  }, [getAvatarUrl, generateRandomSeed])

  const [carouselAvatars, setCarouselAvatars] = useState<Array<{ seed: string, url: string }>>([])

  // Update carousel when style changes
  useEffect(() => {
    if (isCarouselOpen) {
      setCarouselAvatars(getCarouselAvatars(selectedStyle))
    }
  }, [selectedStyle, isCarouselOpen, getCarouselAvatars])

  // Handle style change
  const handleStyleChange = useCallback((styleId: string) => {
    setSelectedStyle(styleId)
    setPreviewKey(prev => prev + 1)
    if (isCarouselOpen) {
      setIsCarouselOpen(false)
    }
  }, [isCarouselOpen])

  // Handle regenerate
  const handleRegenerate = useCallback(() => {
    setIsGenerating(true)
    const newSeed = generateRandomSeed()
    setSeed(newSeed)
    setPreviewKey(prev => prev + 1)
    setTimeout(() => setIsGenerating(false), 300)
  }, [generateRandomSeed])

  // Handle reset to default (user's name)
  const handleResetToDefault = useCallback(() => {
    setSeed(userName)
    setPreviewKey(prev => prev + 1)
  }, [userName])

  // Handle carousel avatar selection
  const handleCarouselSelect = useCallback((selectedSeed: string) => {
    setSeed(selectedSeed)
    setPreviewKey(prev => prev + 1)
    setIsCarouselOpen(false)
  }, [])

  // Handle save
  const handleSave = useCallback(() => {
    onSave(selectedStyle, seed)
    onClose()
  }, [selectedStyle, seed, onSave, onClose])

  // Handle image error - mark style as failed
  const handleImageError = useCallback((styleId: string) => {
    setFailedStyles(prev => new Set(prev).add(styleId))
  }, [])

  // Get filtered styles based on category
  const filteredStyles = activeCategory === 'all' 
    ? AVATAR_STYLES 
    : AVATAR_STYLES.filter(s => s.category === activeCategory)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const currentAvatarUrl = getAvatarUrl(selectedStyle, seed)
  const currentStyleLabel = AVATAR_STYLES.find(s => s.id === selectedStyle)?.label || selectedStyle

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-[#1A1A1A] rounded-2xl border border-[#242424] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        style={{
          animation: 'scaleIn 0.3s ease-out forwards',
        }}
      >
        <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes crossfade {
            0% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 0.8; }
            100% { opacity: 1; transform: scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-scaleIn {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#242424] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
              <Icon icon="mdi:palette-outline" className="h-5 w-5 text-[#5CB85C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Customize Avatar</h3>
              <p className="text-xs text-[#6B7280]">Choose from {AVATAR_STYLES.length} unique styles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-[#242424]"
            aria-label="Close"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 modal-scrollbar">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#5CB85C]/10 blur-xl" />
              <div className="relative w-32 h-32 rounded-full border-2 border-[#5CB85C]/30 overflow-hidden bg-[#111111]">
                <img
                  key={previewKey}
                  src={currentAvatarUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{
                    animation: isGenerating ? 'crossfade 0.3s ease-out' : 'none'
                  }}
                  onError={() => handleImageError(selectedStyle)}
                />
                {/* Style badge */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full text-[9px] text-white/80 font-medium whitespace-nowrap">
                  {currentStyleLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <p className="text-sm font-medium text-white mb-2">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-[#5CB85C] text-black'
                      : 'bg-[#242424] text-[#9A9A9A] hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  <Icon icon={category.icon} className="h-3.5 w-3.5" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection Grid */}
          <div>
            <p className="text-sm font-medium text-white mb-2">
              {activeCategory === 'all' ? 'All Styles' : `${CATEGORIES.find(c => c.id === activeCategory)?.label} Styles`}
              <span className="text-xs text-[#6B7280] ml-2">({filteredStyles.length})</span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filteredStyles.map((style) => {
                const isFailed = failedStyles.has(style.id)
                return (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-200 ${
                      selectedStyle === style.id
                        ? 'border-[#5CB85C] bg-[#5CB85C]/10 shadow-lg shadow-[#5CB85C]/10'
                        : 'border-[#242424] bg-[#111111] hover:border-[#5CB85C]/30 hover:bg-[#1A1A1A]'
                    }`}
                    title={style.description}
                  >
                    {/* Small preview of the style */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0d0d1a] border border-[#242424] flex-shrink-0">
                      {!isFailed ? (
                        <img
                          src={`${DICEBEAR_BASE_URL}/${style.id}/svg?seed=${encodeURIComponent(userName)}&backgroundColor=transparent`}
                          alt={style.label}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={() => handleImageError(style.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                          <Icon icon="mdi:emoticon-sad-outline" className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] font-medium ${
                      selectedStyle === style.id ? 'text-white' : 'text-[#9A9A9A]'
                    }`}>
                      {style.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRegenerate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#242424] text-white rounded-xl hover:bg-[#2A2A2A] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium text-sm"
            >
              <Icon icon="mdi:dice-multiple" className="h-4 w-4" />
              Generate Another
            </button>
            <button
              onClick={() => setIsCarouselOpen(!isCarouselOpen)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1A1A] border border-[#242424] text-[#9A9A9A] rounded-xl hover:text-white hover:border-[#5CB85C]/30 transition-all duration-200 font-medium text-sm"
            >
              <Icon icon="mdi:view-carousel" className="h-4 w-4" />
              {isCarouselOpen ? 'Hide More' : 'More Options'}
            </button>
            <button
              onClick={handleResetToDefault}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1A1A] border border-[#242424] text-[#9A9A9A] rounded-xl hover:text-white hover:border-[#5CB85C]/30 transition-all duration-200 font-medium text-sm"
            >
              <Icon icon="mdi:undo" className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Carousel - More Options */}
          {isCarouselOpen && (
            <div className="bg-[#111111] rounded-xl border border-[#242424] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white">More {currentStyleLabel} Avatars</p>
                <span className="text-[10px] text-[#6B7280]">Click to select</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {carouselAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleCarouselSelect(avatar.seed)}
                    className="w-full aspect-square rounded-lg overflow-hidden border-2 border-[#242424] hover:border-[#5CB85C] transition-all duration-200 hover:scale-105"
                  >
                    <img
                      src={avatar.url}
                      alt={`Avatar variation ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#242424] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#9A9A9A] hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Icon icon="mdi:check" className="h-4 w-4" />
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AvatarModal