import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface Notification {
    id: number;
    category: string;
    title: string;
    message: string;
    is_read: boolean;
    icon: string;
    color: string;
    created_at: string;
    created_at_raw: string;
}

interface Props {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
    onMarkAsUnread: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function NotificationCard({
    notification,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
}: Props) {
    const [isHovered, setIsHovered] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            budget: 'Budget Alert',
            savings: 'Savings Update',
            insight: 'Financial Insight',
            monthly: 'Monthly Summary',
        };
        return labels[category] || 'Notification';
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            budget: 'mdi:alert-circle',
            savings: 'mdi:target',
            insight: 'mdi:chart-line',
            monthly: 'mdi:calendar-month',
        };
        return icons[category] || 'mdi:bell-outline';
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            budget: '#EF4444',
            savings: '#8B5CF6',
            insight: '#3B82F6',
            monthly: '#F59E0B',
        };
        return colors[category] || '#5CB85C';
    };

    const handleMarkToggle = () => {
        if (notification.is_read) {
            onMarkAsUnread(notification.id);
        } else {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <div
            className={`bg-[#111111] border rounded-2xl p-4 transition-all duration-200 ${
                notification.is_read
                    ? 'border-[#242424] opacity-70'
                    : 'border-[#5CB85C]'
            } ${isHovered ? 'border-[#5CB85C]' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setShowActions(false);
            }}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: `${getCategoryColor(notification.category)}20`,
                        }}
                    >
                        <Icon
                            icon={getCategoryIcon(notification.category)}
                            className="w-5 h-5"
                            style={{ color: getCategoryColor(notification.category) }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-white">
                                    {notification.title}
                                </span>
                                {!notification.is_read && (
                                    <span className="w-2 h-2 rounded-full bg-[#5CB85C] animate-pulse flex-shrink-0" />
                                )}
                            </div>
                            <span className="text-xs text-[#6B7280]">
                                {getCategoryLabel(notification.category)}
                            </span>
                        </div>
                        <span className="text-xs text-[#6B7280] flex-shrink-0">
                            {notification.created_at}
                        </span>
                    </div>

                    <p className="text-sm text-[#9A9A9A] mt-1">
                        {notification.message}
                    </p>

                    {/* Actions - Desktop */}
                    <div className="hidden md:flex items-center gap-2 mt-3">
                        <button
                            onClick={handleMarkToggle}
                            className="text-xs text-[#5CB85C] hover:text-[#4a9e4a] transition-colors flex items-center gap-1"
                        >
                            <Icon
                                icon={notification.is_read ? 'mdi:email-open' : 'mdi:email'}
                                className="w-4 h-4"
                            />
                            {notification.is_read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <span className="text-[#242424]">|</span>
                        <button
                            onClick={() => onDelete(notification.id)}
                            className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            <Icon icon="mdi:delete" className="w-4 h-4" />
                            Delete
                        </button>
                    </div>

                    {/* Actions - Mobile */}
                    <div className="md:hidden flex items-center gap-3 mt-3">
                        <button
                            onClick={handleMarkToggle}
                            className="text-xs text-[#5CB85C] hover:text-[#4a9e4a] transition-colors flex items-center gap-1"
                        >
                            <Icon
                                icon={notification.is_read ? 'mdi:email-open' : 'mdi:email'}
                                className="w-4 h-4"
                            />
                            {notification.is_read ? 'Unread' : 'Read'}
                        </button>
                        <button
                            onClick={() => onDelete(notification.id)}
                            className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            <Icon icon="mdi:delete" className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}