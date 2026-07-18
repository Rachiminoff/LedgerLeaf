import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Sidebar } from '@/Components/Dashboard/Sidebar';
import { TopNav } from '@/Components/Dashboard/TopNav';
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
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseFilters } from '@/hooks/useExpenseFilters';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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

const ExpensesIndex: React.FC = () => {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingExpense, setEditingExpense] = useState<any>(null);

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

    useEffect(() => {
        fetchExpenses(filters);
    }, [filters]);

    const handleViewExpense = (expense: any) => {
        setSelectedExpense(expense);
        setIsDrawerOpen(true);
    };

    const handleEditExpense = (expense: any) => {
        setEditingExpense(expense);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCreateExpense = () => {
        setEditingExpense(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleSaveExpense = async (data: any) => {
        if (modalMode === 'create') {
            await createExpense(data);
        } else {
            await updateExpense(editingExpense!.id, data);
        }
        setIsModalOpen(false);
        fetchExpenses(filters);
    };

    const handleArchiveExpense = async (id: number) => {
        await archiveExpense(id);
        fetchExpenses(filters);
    };

    const handleDeleteExpense = async (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
            fetchExpenses(filters);
        }
    };

    const handlePageChange = (page: number) => {
        fetchExpenses({ ...filters, page });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleNotificationClick = () => {
        router.visit('/notifications');
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
                                        <div className="text-6xl mb-4">📭</div>
                                        <h3 className="text-lg font-medium text-white">No expenses yet</h3>
                                        <p className="text-[#9A9A9A] mt-1 text-sm">
                                            Start tracking your spending by recording your first expense.
                                        </p>
                                        <button
                                            onClick={handleCreateExpense}
                                            className="mt-4 px-4 py-2 bg-[#5CB85C] text-white rounded-lg hover:bg-[#4CAF50] transition-colors"
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
                                                                        ? 'bg-[#5CB85C] text-white'
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
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExpense}
                mode={modalMode}
                expense={editingExpense}
            />
        </div>
    );
};

export default ExpensesIndex;