import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { LogoutModal } from '@/Components/ui/LogoutModal';

interface AccountSettingsProps {
    onUpdateSettings?: (settings: { dark_theme: boolean; email_notifications: boolean }) => Promise<void> | void;
    onLogout?: () => void;
}

export default function AccountSettings({ onLogout }: AccountSettingsProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        if (onLogout) {
            onLogout();
            return;
        }
        router.post('/logout');
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Account</h3>

                <button
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 font-medium rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                    <Icon icon="mdi:logout" className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
}