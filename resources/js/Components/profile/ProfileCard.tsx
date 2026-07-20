import React from 'react';
import { Icon } from '@iconify/react';

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

export default function ProfileCard({ user }: Props) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isVerified = user.email_verified_at !== null;

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 hover:border-[#5CB85C] transition-all duration-300">
            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#5CB85C] to-[#3d8b3d] flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0">
                    {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-semibold text-white truncate">
                        {user.name}
                    </h2>
                    <p className="text-sm text-[#9A9A9A] truncate">
                        {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
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
    );
}