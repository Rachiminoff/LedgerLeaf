import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { toastSuccess, toastError, toastWarning } from '@/Components/ui/Toast';
import { Sidebar } from '@/Components/Dashboard/Sidebar';
import { TopNav } from '@/Components/Dashboard/TopNav';
import NotificationFeed from '@/Components/Notifications/NotificationFeed';
import NotificationSummary from '@/Components/Notifications/NotificationSummary';
import NotificationFilters from '@/Components/Notifications/NotificationFilters';
import EmptyState from '@/Components/Notifications/EmptyState';
import { useNotifications } from '@/hooks/useNotifications';
import { SkeletonCard } from '@/Components/ui/skeleton';

interface Props {
    notifications: any;
    unread_count: number;
    summary: any;
}

export default function NotificationsIndex({ notifications, unread_count, summary }: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [notifData, setNotifData] = useState(notifications);
    const [unreadCount, setUnreadCount] = useState(unread_count);

    const {
        loading,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
    } = useNotifications();

    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    const handleFilterChange = async (newFilter: string) => {
        setFilter(newFilter);
        const data = await fetchNotifications(newFilter);
        if (data) {
            setNotifData(data);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        const success = await markAsRead(id);
        if (success) {
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifData(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(group => {
                    updated[group] = updated[group].map((n: any) =>
                        n.id === id ? { ...n, is_read: true } : n
                    );
                });
                return updated;
            });
            toastSuccess('Notification marked as read');
        } else {
            toastError('Failed to mark notification as read');
        }
    };

    const handleMarkAsUnread = async (id: number) => {
        const success = await markAsUnread(id);
        if (success) {
            setUnreadCount(prev => prev + 1);
            setNotifData(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(group => {
                    updated[group] = updated[group].map((n: any) =>
                        n.id === id ? { ...n, is_read: false } : n
                    );
                });
                return updated;
            });
            toastSuccess('Notification marked as unread');
        } else {
            toastError('Failed to mark notification as unread');
        }
    };

    const handleDelete = async (id: number) => {
        const success = await deleteNotification(id);
        if (success) {
            setNotifData(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(group => {
                    updated[group] = updated[group].filter((n: any) => n.id !== id);
                });
                // Remove empty groups
                Object.keys(updated).forEach(group => {
                    if (updated[group].length === 0) {
                        delete updated[group];
                    }
                });
                return updated;
            });
            toastSuccess('Notification deleted');
        } else {
            toastError('Failed to delete notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        const success = await markAllAsRead();
        if (success) {
            setUnreadCount(0);
            setNotifData(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(group => {
                    updated[group] = updated[group].map((n: any) => ({ ...n, is_read: true }));
                });
                return updated;
            });
            toastSuccess('All notifications marked as read');
        } else {
            toastError('Failed to mark all notifications as read');
        }
    };

    const hasNotifications = Object.keys(notifData).length > 0;

    return (
        <>
            <Head title="Notifications | LedgerLeaf" />
            <div className="min-h-screen bg-[#000000]">
                <Sidebar activePage="notifications" onLogout={handleLogout} />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Notifications"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={unreadCount}
                    />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">Notifications</h1>
                                <p className="text-sm text-[#9A9A9A] mt-1">
                                    Stay informed about your financial activity.
                                </p>
                            </div>

                            {/* Notification Summary */}
                            <NotificationSummary summary={summary} unreadCount={unreadCount} />

                            {/* Filters */}
                            <NotificationFilters
                                activeFilter={filter}
                                onFilterChange={handleFilterChange}
                                onMarkAllAsRead={handleMarkAllAsRead}
                                hasUnread={unreadCount > 0}
                                loading={loading}
                            />

                            {loading && !hasNotifications ? (
                                <div className="space-y-4 mt-6">
                                    {[1, 2, 3].map((i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            ) : hasNotifications ? (
                                <NotificationFeed
                                    notifications={notifData}
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}