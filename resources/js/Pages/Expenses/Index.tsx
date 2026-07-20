import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { toastSuccess, toastError, toastWarning } from '@/Components/ui/Toast';
import { Sidebar } from '@/Components/dashboard/Sidebar';
import { TopNav } from '@/Components/dashboard/TopNav';
import ExpenseHeader from '@/Components/expenses/ExpenseHeader';
import ExpenseSummaryCards from '@/Components/expenses/ExpenseSummaryCards';
import QuickActions from '@/Components/expenses/QuickActions';
import ExpenseFilters from '@/Components/expenses/ExpenseFilters';
import ExpenseTable from '@/Components/expenses/ExpenseTable';
import ExpenseCard from '@/Components/expenses/ExpenseCard';
import ExpenseStats from '@/Components/expenses/ExpenseStats';
import InsightsPanel from '@/Components/expenses/InsightsPanel';
import ExpenseDrawer from '@/Components/expenses/ExpenseDrawer';
import ExpenseModal from '@/Components/expenses/ExpenseModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseFilters } from '@/hooks/useExpenseFilters';
import { usePockets } from '@/hooks/usePockets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Skeleton } from '@/Components/ui/skeleton';
import { Icon } from '@iconify/react';
import axios from 'axios';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function ExpensesIndex() {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Record<string, any> | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingExpense, setEditingExpense] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilterCount, setActiveFilterCount] = useState(0);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
        type: 'danger' | 'warning' | 'info';
        confirmText: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: () => {},
        type: 'danger',
        confirmText: 'Confirm',
    });

    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    const {
        expenses,
        loading,
        summary,
        stats,
        insights,
        pagination,
        fetchExpenses,
        createExpense,
        updateExpense,
        archiveExpense,
        deleteExpense,
    } = useExpenses();

    const { filters, setFilters, resetFilters } = useExpenseFilters();
    const typedFilters = filters as {
        date_range?: 'today' | 'this_week' | 'this_month' | 'last_3_months' | 'custom';
        search?: string;
        sort_by?: 'newest' | 'oldest' | 'highest' | 'lowest';
        page?: number;
        per_page?: number;
    };
    const { pockets, fetchPockets } = usePockets();

    useEffect(() => {
        fetchExpenses(filters);
        fetchPockets();
    }, [filters]);

    // Count active filters
    useEffect(() => {
        const count = Object.values(filters).filter((v: unknown) => v !== '' && v !== null && v !== undefined && v !== 'all').length;
        setActiveFilterCount(count);
    }, [filters]);

    // Auto-dismiss messages
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleViewExpense = (expense: any) => {
        setSelectedExpense(expense);
        setIsDrawerOpen(true);
    };

    const handleEditExpense = (expense: any) => {
        setEditingExpense(expense);
        setModalMode('edit');
        setIsModalOpen(true);
        setError(null);
    };

    const handleCreateExpense = () => {
        setEditingExpense(null);
        setModalMode('create');
        setIsModalOpen(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSaveExpense = async (data: any) => {
        try {
            setError(null);
            setSuccessMessage(null);
            setIsLoading(true);
            
            if (modalMode === 'create') {
                await createExpense(data);
                toastSuccess('Expense added successfully!');
            } else {
                await updateExpense(data.id, data);
                toastSuccess('Expense updated successfully!');
            }
            
            setIsModalOpen(false);
            await Promise.all([
                fetchExpenses(filters),
                fetchPockets()
            ]);
        } catch (err: any) {
            toastError(err.message || 'Failed to save expense');
            console.error('Failed to save expense:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpenseWithPocket = async (data: any) => {
        try {
            setError(null);
            setSuccessMessage(null);
            setIsLoading(true);
            
            const response = await axios.post('/api/pockets/deduct', {
                pocket_id: data.pocket_id,
                amount: data.amount,
                description: data.description,
                expense_date: data.expense_date,
                payment_method: data.payment_method,
                merchant: data.merchant,
                notes: data.notes,
            });

            if (response.data) {
                toastSuccess('Expense added successfully!');
                setIsModalOpen(false);
                await Promise.all([
                    fetchExpenses(filters),
                    fetchPockets()
                ]);
            }
        } catch (err: any) {
            toastError(err.response?.data?.message || 'Failed to add expense');
            console.error('Failed to add expense:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchiveExpense = async (id: number) => {
        const expense = expenses.find((e: any) => e.id === id);
        
        setConfirmModal({
            isOpen: true,
            title: 'Archive Expense',
            message: `Are you sure you want to archive "${expense?.description || 'this expense'}"?`,
            type: 'warning',
            confirmText: 'Archive',
            action: async () => {
                // Close modal first
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await archiveExpense(id);
                    toastSuccess('Expense archived successfully!');
                    await Promise.all([
                        fetchExpenses(filters),
                        fetchPockets()
                    ]);
                } catch (err: any) {
                    toastError(err.message || 'Failed to archive expense');
                }
            },
        });
    };

    const handleDeleteExpense = async (id: number) => {
        const expense = expenses.find((e: any) => e.id === id);
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Expense',
            message: `Are you sure you want to permanently delete "${expense?.description || 'this expense'}"? This action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete',
            action: async () => {
                // Close modal first
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await deleteExpense(id);
                    toastSuccess('Expense deleted successfully!');
                    await Promise.all([
                        fetchExpenses(filters),
                        fetchPockets()
                    ]);
                } catch (err: any) {
                    toastError(err.message || 'Failed to delete expense');
                }
            },
        });
    };

    const handlePageChange = (page: number) => {
        fetchExpenses({ ...filters, page });
        // Scroll to top on mobile
        if (isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleViewArchived = () => {
        router.visit('/expenses/archived');
    };

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
                        title="Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-3 md:p-4">
                                        <Skeleton className="h-3 md:h-4 w-16 md:w-20 bg-[#242424]" />
                                        <Skeleton className="h-5 md:h-6 w-20 md:w-24 bg-[#242424] mt-2" />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-[#111111] border border-[#242424] rounded-xl p-3 md:p-4">
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3 md:gap-4">
                                            <Skeleton className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-[#242424]" />
                                            <div className="flex-1">
                                                <Skeleton className="h-3 md:h-4 w-24 md:w-32 bg-[#242424]" />
                                                <Skeleton className="h-2 md:h-3 w-16 md:w-24 bg-[#242424] mt-1" />
                                            </div>
                                            <Skeleton className="h-3 md:h-4 w-16 md:w-20 bg-[#242424]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Expenses | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar 
                    activePage="expenses" 
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header */}
                            <ExpenseHeader />

                            {/* Summary Cards - Mobile optimized grid */}
                            <ExpenseSummaryCards summary={summary} loading={loading} />

                            {/* Quick Actions */}
                            <QuickActions 
                                onCreateExpense={handleCreateExpense}
                                onViewArchived={handleViewArchived}
                            />

                            {/* Filters with mobile responsive layout */}
                            <ExpenseFilters
                                filters={typedFilters}
                                onFilterChange={setFilters}
                                onReset={resetFilters}
                                activeFilterCount={activeFilterCount}
                            />

                            {/* Main Content Grid - Mobile optimized */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                                {/* Expense List */}
                                <div className="lg:col-span-2">
                                    {expenses.length === 0 && !loading ? (
                                        <div className="bg-[#111111] border border-[#242424] rounded-xl p-8 md:p-12 text-center">
                                            <div className="text-[#9A9A9A] text-6xl mb-4">
                                                <Icon icon="mdi:cash" className="w-16 h-16 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">No expenses yet</h3>
                                            <p className="text-[#9A9A9A] mt-1 text-sm">
                                                Start tracking your spending by recording your first expense.
                                            </p>
                                            <button
                                                onClick={handleCreateExpense}
                                                className="mt-4 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors"
                                            >
                                                Add Expense
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {isMobile ? (
                                                <div className="space-y-3">
                                                    {expenses.map((expense: any) => (
                                                        <ExpenseCard
                                                            key={expense.id}
                                                            expense={expense}
                                                            onView={handleViewExpense}
                                                            onEdit={handleEditExpense}
                                                            onArchive={handleArchiveExpense}
                                                            onDelete={handleDeleteExpense}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <ExpenseTable
                                                    expenses={expenses}
                                                    onView={handleViewExpense}
                                                    onEdit={handleEditExpense}
                                                    onArchive={handleArchiveExpense}
                                                    onDelete={handleDeleteExpense}
                                                />
                                            )}

                                            {/* Pagination - Mobile optimized */}
                                            {pagination && (pagination as { total?: number }).total !== undefined && (pagination as { total?: number }).total! > 0 && (
                                                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                                                    <p className="text-xs sm:text-sm text-[#9A9A9A]">
                                                        Showing {(pagination as { from?: number }).from ?? 0} to {(pagination as { to?: number }).to ?? 0} of {(pagination as { total?: number }).total ?? 0} entries
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                                        <button
                                                            onClick={() => handlePageChange(((pagination as { current_page?: number }).current_page ?? 1) - 1)}
                                                            disabled={((pagination as { current_page?: number }).current_page ?? 1) === 1}
                                                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-[#111111] border border-[#242424] text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5CB85C] transition-colors min-h-[36px] min-w-[36px]"
                                                        >
                                                            <span className="hidden sm:inline">Previous</span>
                                                            <span className="sm:hidden">‹</span>
                                                        </button>
                                                        {Array.from({ length: (pagination as { last_page?: number }).last_page ?? 1 }, (_, i) => i + 1)
                                                            .slice(
                                                                Math.max(0, ((pagination as { current_page?: number }).current_page ?? 1) - (isMobile ? 2 : 3)),
                                                                Math.min((pagination as { last_page?: number }).last_page ?? 1, ((pagination as { current_page?: number }).current_page ?? 1) + (isMobile ? 1 : 2))
                                                            )
                                                            .map((page) => (
                                                                <button
                                                                    key={page}
                                                                    onClick={() => handlePageChange(page)}
                                                                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors min-h-[36px] min-w-[36px] ${
                                                                        page === ((pagination as { current_page?: number }).current_page ?? 1)
                                                                            ? 'bg-[#5CB85C] text-black'
                                                                            : 'bg-[#111111] border border-[#242424] text-[#9A9A9A] hover:border-[#5CB85C]'
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            ))
                                                        }
                                                        <button
                                                            onClick={() => handlePageChange(((pagination as { current_page?: number }).current_page ?? 1) + 1)}
                                                            disabled={((pagination as { current_page?: number }).current_page ?? 1) === ((pagination as { last_page?: number }).last_page ?? 1)}
                                                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-[#111111] border border-[#242424] text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5CB85C] transition-colors min-h-[36px] min-w-[36px]"
                                                        >
                                                            <span className="hidden sm:inline">Next</span>
                                                            <span className="sm:hidden">›</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Stats & Insights - Hidden on mobile, shown below on tablet */}
                                {!isMobile && (
                                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                                        <ExpenseStats stats={stats} loading={loading} />
                                        <InsightsPanel insights={insights} loading={loading} />
                                    </div>
                                )}
                            </div>

                            {/* Mobile Stats & Insights - Shown below the list on mobile */}
                            {isMobile && (
                                <div className="mt-4 space-y-4">
                                    <ExpenseStats stats={stats} loading={loading} />
                                    <InsightsPanel insights={insights} loading={loading} />
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Expense Detail Drawer */}
                <ExpenseDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    expense={selectedExpense}
                    onEdit={handleEditExpense}
                />

                {/* Add/Edit Expense Modal */}
                <ExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setError(null);
                    }}
                    onSave={handleSaveExpense}
                    mode={modalMode}
                    expense={editingExpense}
                    pockets={pockets}
                    onExpenseAdd={handleExpenseWithPocket}
                />

                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
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