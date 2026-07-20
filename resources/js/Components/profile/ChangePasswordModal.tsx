import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '@/Components/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }) => void;
    isLoading: boolean;
}

export default function ChangePasswordModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}: Props) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{
        current_password?: string;
        password?: string;
        password_confirmation?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: typeof errors = {};
        if (!currentPassword) {
            newErrors.current_password = 'Current password is required.';
        }
        if (!newPassword) {
            newErrors.password = 'New password is required.';
        } else if (newPassword.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (newPassword !== confirmPassword) {
            newErrors.password_confirmation = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
        });
    };

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={handleClose} maxWidth="md">
            <div className="bg-[#111111] p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    <button
                        onClick={handleClose}
                        className="text-[#9A9A9A] hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        <Icon icon="mdi:close" className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs text-[#9A9A9A] mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-[#171717] border border-[#242424] rounded-lg px-4 py-2.5 text-white pr-10 focus:outline-none focus:border-[#5CB85C] transition-colors"
                                disabled={isLoading}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
                            >
                                <Icon
                                    icon={showCurrentPassword ? 'mdi:eye-off' : 'mdi:eye'}
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                        {errors.current_password && (
                            <p className="text-xs text-red-500 mt-1">{errors.current_password}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs text-[#9A9A9A] mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-[#171717] border border-[#242424] rounded-lg px-4 py-2.5 text-white pr-10 focus:outline-none focus:border-[#5CB85C] transition-colors"
                                disabled={isLoading}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
                            >
                                <Icon
                                    icon={showNewPassword ? 'mdi:eye-off' : 'mdi:eye'}
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                        <p className="text-xs text-[#6B7280] mt-1">
                            Password must be at least 8 characters
                        </p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-xs text-[#9A9A9A] mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#171717] border border-[#242424] rounded-lg px-4 py-2.5 text-white pr-10 focus:outline-none focus:border-[#5CB85C] transition-colors"
                                disabled={isLoading}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
                            >
                                <Icon
                                    icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'}
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-[#171717] border border-[#242424] text-white font-medium rounded-lg hover:bg-[#1f1f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-[#5CB85C] text-black font-medium rounded-lg hover:bg-[#4a9e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}