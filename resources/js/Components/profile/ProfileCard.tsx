import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { AvatarModal } from '@/Components/ui/AvatarModal';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    member_since: string;
}

interface Props {
    user: User;
}

const STORAGE_KEY_STYLE = 'ledgerleaf_avatar_style'
const STORAGE_KEY_SEED = 'ledgerleaf_avatar_seed'

export default function ProfileCard({ user }: Props) {
    const [avatarStyle, setAvatarStyle] = useState<string>('shapes')
    const [avatarSeed, setAvatarSeed] = useState<string>(user?.name || 'User')
    const [avatarError, setAvatarError] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            setAvatarSeed(user?.name || 'User')
        }
    }, [user?.name])

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate DiceBear avatar URL
    const avatarUrl = useMemo(() => {
        const encodedSeed = encodeURIComponent(avatarSeed)
        return `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodedSeed}&backgroundColor=transparent`
    }, [avatarStyle, avatarSeed])

    const handleAvatarError = () => {
        setAvatarError(true)
    }

    const handleAvatarClick = () => {
        setIsModalOpen(true)
    }

    const handleAvatarSave = (style: string, seed: string) => {
        setAvatarStyle(style)
        setAvatarSeed(seed)
        localStorage.setItem(STORAGE_KEY_STYLE, style)
        localStorage.setItem(STORAGE_KEY_SEED, seed)
    }

    const isVerified = user.email_verified_at !== null;

    return (
        <>
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 hover:border-[#5CB85C] transition-all duration-300">
                {/* Profile Avatar & Name */}
                <div className="flex items-center gap-4 mb-6">
                    <div 
                        className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer group/avatar"
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
                        {/* Avatar Glow */}
                        <div className="absolute inset-0 rounded-full bg-[#5CB85C]/10 blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                        
                        {/* Avatar Container */}
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#242424] group-hover/avatar:border-[#5CB85C] group-hover/avatar:scale-105 transition-all duration-300 bg-gradient-to-br from-[#5CB85C] to-[#3d8b3d]">
                            {!avatarError ? (
                                <>
                                    <img
                                        src={avatarUrl}
                                        alt={`${user.name}'s avatar`}
                                        className="w-full h-full object-cover"
                                        onError={handleAvatarError}
                                        loading="lazy"
                                        draggable={false}
                                    />
                                    {/* Camera icon overlay on hover */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                        <div className="bg-[#5CB85C] rounded-full p-1.5 shadow-lg">
                                            <Icon icon="mdi:camera-outline" className="w-4 h-4 text-black" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                                    {getInitials(user.name)}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-semibold text-white truncate">
                            {user.name}
                        </h2>
                        <p className="text-sm text-[#9A9A9A] truncate">
                            {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                isVerified
                                    ? 'bg-green-500/10 text-[#5CB85C]'
                                    : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                                <Icon
                                    icon={isVerified ? 'mdi:check-circle' : 'mdi:alert-circle'}
                                    className="w-3 h-3"
                                />
                                {isVerified ? 'Verified' : 'Unverified'}
                            </span>
                            <span className="text-xs text-[#6B7280]">
                                Member since {user.member_since}
                            </span>
                            {/* Avatar style indicator */}
                            <span className="text-[9px] text-[#6B7280] bg-[#242424] px-2 py-0.5 rounded-full">
                                {avatarStyle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] border border-[#242424] rounded-xl text-white hover:border-[#5CB85C] hover:bg-[#1f1f1f] transition-all duration-200 text-sm"
                        onClick={() => document.getElementById('profile-information')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Icon icon="mdi:pencil" className="w-4 h-4" />
                        Edit Profile
                    </button>
                    <button
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] border border-[#242424] rounded-xl text-white hover:border-[#5CB85C] hover:bg-[#1f1f1f] transition-all duration-200 text-sm"
                        onClick={() => document.getElementById('change-password-trigger')?.click()}
                    >
                        <Icon icon="mdi:key" className="w-4 h-4" />
                        Change Password
                    </button>
                </div>
            </div>

            {/* Avatar Modal */}
            <AvatarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStyle={avatarStyle}
                currentSeed={avatarSeed}
                userName={user.name}
                onSave={handleAvatarSave}
            />
        </>
    );
}