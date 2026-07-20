import React from 'react';
import { Icon } from '@iconify/react';

export default function EmptyState() {
    return (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#171717] flex items-center justify-center">
                <Icon
                    icon="mdi:bell-off"
                    className="w-10 h-10 text-[#6B7280]"
                />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
                No notifications yet
            </h3>
            <p className="text-sm text-[#9A9A9A] max-w-md mx-auto">
                We'll notify you whenever there's something important about your finances.
                Check back later for updates.
            </p>
        </div>
    );
}