import { useState } from 'react';

export function useNotifications() {
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async (category: string = 'all') => {
        setLoading(true);
        try {
            const response = await fetch(`/notifications/data?category=${category}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            return data.notifications;
        } catch (error) {
            console.error('Fetch notifications error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            return response.ok;
        } catch (error) {
            console.error('Mark as read error:', error);
            return false;
        }
    };

    const markAsUnread = async (id: number) => {
        try {
            const response = await fetch(`/notifications/${id}/unread`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            return response.ok;
        } catch (error) {
            console.error('Mark as unread error:', error);
            return false;
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            const response = await fetch(`/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            return response.ok;
        } catch (error) {
            console.error('Delete notification error:', error);
            return false;
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            return response.ok;
        } catch (error) {
            console.error('Mark all as read error:', error);
            return false;
        }
    };

    return {
        loading,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
    };
}