import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Sidebar } from '@/Components/dashboard/Sidebar';
import { TopNav } from '@/Components/dashboard/TopNav';
import { Icon } from '@iconify/react';
import { useExpenses } from '@/hooks/useExpenses';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toastSuccess, toastError } from '@/Components/ui/Toast';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { Skeleton } from '@/Components/ui/skeleton';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

interface ConfirmModalConfig {
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
}

export default function ArchivedExpenses() {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>({
        isOpen: false,
        title: '',
        message: '',
        action: () => {},
        type: 'danger',
        confirmText: 'Confirm',
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    const {
        expenses,
        loading,
        fetchExpenses,
        restoreExpense,
        deleteExpense,
    } = useExpenses();

    // Fetch only archived expenses
    useEffect(() => {
        fetchExpenses({ is_archived: true });
    }, []);

    const handleLogout = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Logout',
            message: 'Are you sure you want to log out?',
            type: 'warning',
            confirmText: 'Logout',
            action: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                router.post('/logout');
            },
        });
    };

    const handleRestore = (id: number) => {
        const expense = expenses.find((e: any) => e.id === id);
        setConfirmModal({
            isOpen: true,
            title: 'Restore Expense',
            message: `Are you sure you want to restore "${expense?.description || 'this expense'}"? It will be moved back to your active expenses.`,
            type: 'warning',
            confirmText: 'Restore',
            action: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await restoreExpense(id);
                    toastSuccess('Expense restored successfully!');
                    await fetchExpenses({ is_archived: true });
                } catch (err: any) {
                    toastError(err.message || 'Failed to restore expense');
                }
            },
        });
    };

    const handleDelete = (id: number) => {
        const expense = expenses.find((e: any) => e.id === id);
        setConfirmModal({
            isOpen: true,
            title: 'Delete Expense',
            message: `Are you sure you want to permanently delete "${expense?.description || 'this expense'}"? This action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete',
            action: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await deleteExpense(id);
                    toastSuccess('Expense deleted permanently!');
                    await fetchExpenses({ is_archived: true });
                } catch (err: any) {
                    toastError(err.message || 'Failed to delete expense');
                }
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            'Food': 'mdi:food',
            'Transport': 'mdi:car',
            'Entertainment': 'mdi:movie',
            'Utilities': 'mdi:lightbulb',
            'Shopping': 'mdi:shopping',
            'Healthcare': 'mdi:medical-bag',
            'Education': 'mdi:school',
            'Other': 'mdi:dots-horizontal',
        };
        return icons[category] || 'mdi:circle-outline';
    };

    // Loading skeleton
    if (loading && expenses.length === 0) {
        return (
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar
                    activePage="expenses"
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Archived Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />
                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4 animate-pulse">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <Skeleton className="w-10 h-10 rounded-full bg-[#242424]" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-32 bg-[#242424] rounded" />
                                                <Skeleton className="h-3 w-20 bg-[#242424] rounded mt-1" />
                                            </div>
                                            <Skeleton className="h-4 w-16 bg-[#242424] rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Archived Expenses | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar
                    activePage="expenses"
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Archived Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header - Mobile Optimized */}
                            <div className="flex flex-col gap-3 mb-4 md:mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                                            Archived Expenses
                                        </h1>
                                        <p className="text-xs sm:text-sm text-[#9A9A9A] mt-0.5 sm:mt-1">
                                            View and manage your archived expenses.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.visit('/expenses')}
                                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#111111] border border-[#242424] text-white rounded-xl hover:bg-[#1A1A1A] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap self-start sm:self-auto"
                                    >
                                        <Icon icon="mdi:arrow-left" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Back to Expenses</span>
                                        <span className="xs:hidden">Back</span>
                                    </button>
                                </div>
                            </div>

                            {/* Archived Expenses List - Mobile Optimized */}
                            {expenses.length === 0 && !loading ? (
                                <div className="bg-[#111111] border border-[#242424] rounded-xl p-8 sm:p-12 text-center">
                                    <div className="text-[#9A9A9A] text-5xl sm:text-6xl mb-3 sm:mb-4">
                                        <Icon icon="mdi:archive-outline" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-white">No archived expenses</h3>
                                    <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1">
                                        Expenses you archive will appear here.
                                    </p>
                                    <button
                                        onClick={() => router.visit('/expenses')}
                                        className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm"
                                    >
                                        Go to Expenses
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5 sm:space-y-3">
                                    {expenses.map((expense: any) => (
                                        <div
                                            key={expense.id}
                                            className="bg-[#111111] border border-[#242424] rounded-xl p-3 sm:p-4 hover:border-[#5CB85C]/30 transition-colors"
                                        >
                                            {/* Mobile Card Layout */}
                                            <div className="flex flex-col gap-2 sm:gap-3">
                                                {/* Top Row: Icon, Description, Amount */}
                                                <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                                                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center flex-shrink-0">
                                                            <Icon
                                                                icon={getCategoryIcon(expense.category_name || 'Other')}
                                                                className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A9A9A]"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm sm:text-base text-white font-medium truncate">
                                                                {expense.description}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                                                <span className="text-xs text-[#9A9A9A]">
                                                                    {expense.category_name || 'Uncategorized'}
                                                                </span>
                                                                {expense.pocket_name && (
                                                                    <>
                                                                        <span className="text-xs text-[#242424]">•</span>
                                                                        <span className="text-xs text-[#9A9A9A] truncate max-w-[60px] sm:max-w-none">
                                                                            {expense.pocket_name}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <p className="text-sm sm:text-base text-white font-medium whitespace-nowrap">
                                                            {formatCurrency(expense.amount)}
                                                        </p>
                                                        <span className="text-[10px] sm:text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                                                            Archived
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Date and Actions */}
                                                <div className="flex items-center justify-between pt-1 sm:pt-0 border-t border-[#242424]/50 sm:border-none">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <span className="text-xs text-[#9A9A9A]">
                                                            {formatDate(expense.expense_date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1.5 sm:gap-2">
                                                        <button
                                                            onClick={() => handleRestore(expense.id)}
                                                            className="p-1.5 sm:p-2 rounded-lg bg-[#1A1A1A] border border-[#242424] text-[#5CB85C] hover:bg-[#5CB85C]/10 hover:border-[#5CB85C] transition-colors"
                                                            title="Restore expense"
                                                        >
                                                            <Icon icon="mdi:restore" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="p-1.5 sm:p-2 rounded-lg bg-[#1A1A1A] border border-[#242424] text-[#FF5A5A] hover:bg-[#FF5A5A]/10 hover:border-[#FF5A5A] transition-colors"
                                                            title="Delete permanently"
                                                        >
                                                            <Icon icon="mdi:delete" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmModal.action}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    type={confirmModal.type}
                    confirmText={confirmModal.confirmText}
                />
            </div>
        </>
    );
}
