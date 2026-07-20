import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    member_since: string;
}

interface Props {
    user: User;
    onUpdate: (data: { name: string; email: string }) => void;
    onOpenChangePassword: () => void;
    isLoading: boolean;
}

export default function ProfileInformation({
    user,
    onUpdate,
    onOpenChangePassword,
    isLoading,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Basic validation
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) {
            newErrors.name = 'Name is required.';
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onUpdate({ name, email });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(user.name);
        setEmail(user.email);
        setErrors({});
        setIsEditing(false);
    };

    return (
        <div id="profile-information" className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Profile Information</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-[#5CB85C] hover:text-[#4a9e4a] transition-colors"
                    >
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-[#9A9A9A] mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#171717] border border-[#242424] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#5CB85C] transition-colors"
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs text-[#9A9A9A] mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#171717] border border-[#242424] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#5CB85C] transition-colors"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-[#5CB85C] text-black font-medium rounded-lg hover:bg-[#4a9e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-[#171717] border border-[#242424] text-white font-medium rounded-lg hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#242424]">
                        <span className="text-sm text-[#9A9A9A]">Name</span>
                        <span className="text-sm text-white">{user.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#242424]">
                        <span className="text-sm text-[#9A9A9A]">Email</span>
                        <span className="text-sm text-white">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#242424]">
                        <span className="text-sm text-[#9A9A9A]">Account ID</span>
                        <span className="text-sm text-white font-mono">#{user.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#242424]">
                        <span className="text-sm text-[#9A9A9A]">Member Since</span>
                        <span className="text-sm text-white">{user.member_since}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-[#9A9A9A]">Password</span>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-white font-mono">••••••••••••••</span>
                            <button
                                id="change-password-trigger"
                                onClick={onOpenChangePassword}
                                className="text-sm text-[#5CB85C] hover:text-[#4a9e4a] transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}