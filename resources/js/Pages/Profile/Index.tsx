import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toastSuccess, toastError, toastWarning } from '@/Components/ui/Toast';
import { Sidebar } from '@/Components/Dashboard/Sidebar';
import { TopNav } from '@/Components/Dashboard/TopNav';
import ProfileCard from '@/Components/Profile/ProfileCard';
import FinancialOverview from '@/Components/Profile/FinancialOverview';
import ProfileInformation from '@/Components/Profile/ProfileInformation';
import ChangePasswordModal from '@/Components/Profile/ChangePasswordModal';
import AccountSettings from '@/Components/Profile/AccountSettings';
import DeleteAccount from '@/Components/Profile/DeleteAccount';
import LoadingSkeleton from '@/Components/Profile/LoadingSkeleton';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    safe_balance: number;
    total_balance: number;
    created_at: string;
    member_since: string;
}

interface Statistics {
    safe_balance: number;
    total_balance: number;
    active_pockets: number;
    total_expenses: number;
    active_savings_goals: number;
}

interface Props {
    user: User;
    statistics: Statistics;
}

export default function ProfileIndex({ user, statistics }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentStatistics, setCurrentStatistics] = useState(statistics);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) {
            console.warn('CSRF token not found in meta tag');
        }
        return token || '';
    };

    // Get headers with CSRF token
    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };
        
        const token = getCsrfToken();
        if (token) {
            headers['X-CSRF-TOKEN'] = token;
        }
        
        return headers;
    };

    // Helper function for fetch requests
    const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
        const response = await fetch(url, {
            ...options,
            credentials: 'same-origin',
            headers: {
                ...getHeaders(),
                ...(options.headers || {}),
            },
        });

        if (response.status === 419) {
            console.warn('CSRF token mismatch, refreshing...');
            const newToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const retryResponse = await fetch(url, {
                ...options,
                credentials: 'same-origin',
                headers: {
                    ...getHeaders(),
                    'X-CSRF-TOKEN': newToken,
                    ...(options.headers || {}),
                },
            });
            return retryResponse;
        }

        return response;
    };

    // Auto-refresh statistics every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStatistics();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetchWithCsrf('/profile/statistics');
            if (response.ok) {
                const data = await response.json();
                setCurrentStatistics(data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const handleProfileUpdate = async (data: { name: string; email: string }) => {
        setIsLoading(true);
        try {
            const response = await fetchWithCsrf('/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toastSuccess('Profile updated successfully!');
                router.reload({ only: ['user'] });
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat();
                    errorMessages.forEach((msg) => toastError(msg as string));
                } else {
                    toastError(result.error || 'Failed to update profile.');
                }
            }
        } catch (error) {
            toastError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }) => {
        setIsLoading(true);
        try {
            const response = await fetchWithCsrf('/profile/password', {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toastSuccess('Password changed successfully!');
                setIsChangePasswordOpen(false);
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat();
                    errorMessages.forEach((msg) => toastError(msg as string));
                } else {
                    toastError(result.error || 'Failed to change password.');
                }
            }
        } catch (error) {
            toastError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingsUpdate = async (settings: {
        dark_theme: boolean;
        email_notifications: boolean;
    }) => {
        try {
            const response = await fetchWithCsrf('/profile/settings', {
                method: 'PUT',
                body: JSON.stringify(settings),
            });

            const result = await response.json();

            if (response.ok) {
                toastSuccess('Settings updated successfully!');
            } else {
                toastError(result.error || 'Failed to update settings.');
            }
        } catch (error) {
            toastError('An unexpected error occurred.');
        }
    };

    const handleDeleteAccount = async (data: { confirmation: string; password: string }) => {
        setIsDeleting(true);
        try {
            const response = await fetchWithCsrf('/profile', {
                method: 'DELETE',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toastSuccess('Account deleted successfully.');
                window.location.href = '/';
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat();
                    errorMessages.forEach((msg) => toastError(msg as string));
                } else {
                    toastError(result.error || 'Failed to delete account.');
                }
            }
        } catch (error) {
            toastError('An unexpected error occurred.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    if (!user) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <Sidebar 
                activePage="profile" 
                onLogout={handleLogout}
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-[280px] min-h-screen">
                <TopNav
                    title="Profile"
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    notificationCount={0}
                />
                
                <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-4 md:mb-6 lg:mb-8 mt-4 md:mt-0">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                                Profile
                            </h1>
                            <p className="text-xs md:text-sm text-[#9A9A9A] mt-1">
                                Manage your account settings and monitor your financial overview
                            </p>
                        </div>

                        {/* Mobile Profile Card - Shows at top on mobile */}
                        <div className="lg:hidden mb-4 md:mb-6">
                            <ProfileCard user={user} />
                        </div>

                        {/* Two-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                            {/* Left Column - Hidden on mobile (shown above) */}
                            <div className="hidden lg:block lg:col-span-1 space-y-6">
                                <ProfileCard user={user} />
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
                                <FinancialOverview statistics={currentStatistics} />
                                
                                <ProfileInformation
                                    user={user}
                                    onUpdate={handleProfileUpdate}
                                    onOpenChangePassword={() => setIsChangePasswordOpen(true)}
                                    isLoading={isLoading}
                                />
                                
                                <AccountSettings
                                    onUpdateSettings={handleSettingsUpdate}
                                    onLogout={handleLogout}
                                />
                                
                                {/* Delete Account - Only this component, no duplicate */}
                                <DeleteAccount
                                    onDelete={handleDeleteAccount}
                                    isDeleting={isDeleting}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                onSubmit={handlePasswordChange}
                isLoading={isLoading}
            />
        </div>
    );
}