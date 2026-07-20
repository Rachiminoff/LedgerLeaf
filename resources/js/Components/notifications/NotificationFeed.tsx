import React from 'react';
import NotificationCard from './NotificationCard';

interface Props {
    notifications: Record<string, any[]>;
    onMarkAsRead: (id: number) => void;
    onMarkAsUnread: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function NotificationFeed({
    notifications,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
}: Props) {
    const groupLabels: Record<string, string> = {
        today: 'Today',
        yesterday: 'Yesterday',
        this_week: 'Earlier This Week',
        older: 'Older',
    };

    return (
        <div className="mt-6 space-y-8">
            {Object.entries(notifications).map(([group, items]) => (
                <div key={group}>
                    <h3 className="text-sm font-medium text-[#6B7280] mb-3">
                        {groupLabels[group] || group}
                    </h3>
                    <div className="space-y-3">
                        {items.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={onMarkAsRead}
                                onMarkAsUnread={onMarkAsUnread}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}