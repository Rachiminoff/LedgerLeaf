// resources/js/Pages/Expenses/Index.tsx
import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
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
import axios from 'axios';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function ExpensesIndex() {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
    const { pockets, fetchPockets } = usePockets();

    useEffect(() => {
        fetchExpenses(filters);
        fetchPockets();
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
            
            console.log('Saving expense - Mode:', modalMode);
            console.log('Data:', data);
            
            if (modalMode === 'create') {
                await createExpense(data);
                setSuccessMessage('Expense added successfully!');
            } else {
                // ✅ Update existing expense - data includes id
                await updateExpense(data.id, data);
                setSuccessMessage('Expense updated successfully!');
            }
            
            setIsModalOpen(false);
            await Promise.all([
                fetchExpenses(filters),
                fetchPockets()
            ]);
        } catch (err: any) {
            setError(err.message || 'Failed to save expense');
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
                setSuccessMessage('Expense added successfully!');
                setIsModalOpen(false);
                await Promise.all([
                    fetchExpenses(filters),
                    fetchPockets()
                ]);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add expense');
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
                try {
                    await archiveExpense(id);
                    setSuccessMessage('Expense archived successfully!');
                    await Promise.all([
                        fetchExpenses(filters),
                        fetchPockets()
                    ]);
                } catch (err: any) {
                    setError(err.message || 'Failed to archive expense');
                }
            },
        });
    };

    const handleDeleteExpense = async (id: number) => {
        const expense = expenses.find((e: any) => e.id === id);
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Expense',
            message: `Are you sure you want to permanently delete "${expense?.description || 'this expense'}"?`,
            type: 'danger',
            confirmText: 'Delete',
            action: async () => {
                try {
                    await deleteExpense(id);
                    setSuccessMessage('Expense deleted successfully!');
                    await Promise.all([
                        fetchExpenses(filters),
                        fetchPockets()
                    ]);
                } catch (err: any) {
                    setError(err.message || 'Failed to delete expense');
                }
            },
        });
    };

    const handlePageChange = (page: number) => {
        fetchExpenses({ ...filters, page });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    if (loading && expenses.length === 0) {
        return (
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="expenses" onLogout={handleLogout} />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                        <Skeleton className="h-4 w-20 bg-[#242424]" />
                                        <Skeleton className="h-6 w-24 bg-[#242424] mt-2" />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Skeleton className="h-10 w-10 rounded-full bg-[#242424]" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-32 bg-[#242424]" />
                                                <Skeleton className="h-3 w-24 bg-[#242424] mt-1" />
                                            </div>
                                            <Skeleton className="h-4 w-20 bg-[#242424]" />
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
                <Sidebar activePage="expenses" onLogout={handleLogout} />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Expenses"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="mb-4 p-4 bg-[#5CB85C]/10 border border-[#5CB85C]/30 rounded-xl text-[#5CB85C] text-sm">
                                    {successMessage}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Header */}
                            <ExpenseHeader />

                            {/* Summary Cards */}
                            <ExpenseSummaryCards summary={summary} loading={loading} />

                            {/* Quick Actions */}
                            <QuickActions onCreateExpense={handleCreateExpense} />

                            {/* Filters */}
                            <ExpenseFilters
                                filters={filters}
                                onFilterChange={setFilters}
                                onReset={resetFilters}
                            />

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                {/* Expense List - 2/3 on desktop */}
                                <div className="lg:col-span-2">
                                    {expenses.length === 0 && !loading ? (
                                        <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
                                            <div className="text-[#9A9A9A] text-6xl mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1m0 1v1m0 1v1m0 1v1" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 10s4.477 10 10 10z" />
                                                </svg>
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
                                                <div className="space-y-4">
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

                                            {/* Pagination */}
                                            {pagination && (
                                                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                                    <p className="text-sm text-[#9A9A9A]">
                                                        Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                                            disabled={pagination.current_page === 1}
                                                            className="px-3 py-1 rounded-lg bg-[#111111] border border-[#242424] text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5CB85C] transition-colors"
                                                        >
                                                            Previous
                                                        </button>
                                                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                                                            .slice(
                                                                Math.max(0, pagination.current_page - 3),
                                                                Math.min(pagination.last_page, pagination.current_page + 2)
                                                            )
                                                            .map((page) => (
                                                                <button
                                                                    key={page}
                                                                    onClick={() => handlePageChange(page)}
                                                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                                                        page === pagination.current_page
                                                                            ? 'bg-[#5CB85C] text-black'
                                                                            : 'bg-[#111111] border border-[#242424] text-[#9A9A9A] hover:border-[#5CB85C]'
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            ))
                                                        }
                                                        <button
                                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                                            disabled={pagination.current_page === pagination.last_page}
                                                            className="px-3 py-1 rounded-lg bg-[#111111] border border-[#242424] text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#5CB85C] transition-colors"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Stats & Insights - 1/3 on desktop */}
                                <div className="lg:col-span-1 space-y-6">
                                    <ExpenseStats stats={stats} loading={loading} />
                                    <InsightsPanel insights={insights} loading={loading} />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Expense Detail Drawer - Only Edit button */}
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