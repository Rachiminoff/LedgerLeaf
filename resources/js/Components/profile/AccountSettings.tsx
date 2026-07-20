import React from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

export default function AccountSettings() {
    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Account</h3>

            <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 font-medium rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
                <Icon icon="mdi:logout" className="w-4 h-4" />
                Logout
            </button>
        </div>
    );
}