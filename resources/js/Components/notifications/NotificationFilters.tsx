import React from 'react';
import { Icon } from '@iconify/react';

interface Props {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onMarkAllAsRead: () => void;
    hasUnread: boolean;
    loading: boolean;
}

export default function NotificationFilters({
    activeFilter,
    onFilterChange,
    onMarkAllAsRead,
    hasUnread,
    loading,
}: Props) {
    const filters = [
        { id: 'all', label: 'All', icon: 'mdi:view-list' },
        { id: 'budget', label: 'Budget', icon: 'mdi:alert-circle' },
        { id: 'savings', label: 'Savings', icon: 'mdi:target' },
        { id: 'insight', label: 'Insights', icon: 'mdi:chart-line' },
        { id: 'monthly', label: 'Monthly', icon: 'mdi:calendar-month' },
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeFilter === filter.id
                                ? 'bg-[#5CB85C] text-black'
                                : 'bg-[#171717] text-[#9A9A9A] hover:text-white hover:bg-[#1f1f1f]'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Icon icon={filter.icon} className="w-4 h-4" />
                        {filter.label}
                    </button>
                ))}
            </div>

            {hasUnread && (
                <button
                    onClick={onMarkAllAsRead}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#5CB85C] hover:text-[#4a9e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icon icon="mdi:check-all" className="w-4 h-4" />
                    Mark All as Read
                </button>
            )}
        </div>
    );
}