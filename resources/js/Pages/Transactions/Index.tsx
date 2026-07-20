import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Sidebar } from '@/Components/Dashboard/Sidebar';
import { TopNav } from '@/Components/Dashboard/TopNav';
import { useTransactions } from '@/hooks/useTransactions';
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

export default function TransactionsIndex() {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const {
        transactions,
        loading,
        summary,
        pagination,
        filters,
        fetchTransactions,
        resetFilters,
        setFilters,
    } = useTransactions();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    const handlePageChange = (page: number) => {
        fetchTransactions({ page });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionBadgeColor = (action: string) => {
        const colors: Record<string, string> = {
            'create_pocket': 'bg-[#5CB85C]/20 text-[#5CB85C]',
            'update_pocket': 'bg-[#3B82F6]/20 text-[#3B82F6]',
            'archive_pocket': 'bg-[#F59E0B]/20 text-[#F59E0B]',
            'delete_pocket': 'bg-[#EF4444]/20 text-[#EF4444]',
            'restore_pocket': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'refund_pocket': 'bg-[#10B981]/20 text-[#10B981]',
            'allocate_funds': 'bg-[#5CB85C]/20 text-[#5CB85C]',
            'transfer_funds': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'create_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
            'update_expense': 'bg-[#3B82F6]/20 text-[#3B82F6]',
            'delete_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
            'archive_expense': 'bg-[#F59E0B]/20 text-[#F59E0B]',
            'restore_expense': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
            'deposit': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        };
        return colors[action] || 'bg-[#242424]/20 text-[#9A9A9A]';
    };

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            'create_pocket': 'Pocket Created',
            'update_pocket': 'Pocket Updated',
            'archive_pocket': 'Pocket Archived',
            'delete_pocket': 'Pocket Deleted',
            'restore_pocket': 'Pocket Restored',
            'refund_pocket': 'Pocket Refunded',
            'allocate_funds': 'Funds Allocated',
            'transfer_funds': 'Funds Transferred',
            'create_expense': 'Expense Created',
            'update_expense': 'Expense Updated',
            'delete_expense': 'Expense Deleted',
            'archive_expense': 'Expense Archived',
            'restore_expense': 'Expense Restored',
            'deposit': 'Fund Deposit',
        };
        return labels[action] || action;
    };

    if (loading && transactions.length === 0) {
        return (
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="transactions" onLogout={handleLogout} />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav title="Transactions" onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} notificationCount={0} />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                                <div className="space-y-4">
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
            <Head title="Transactions | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="transactions" onLogout={handleLogout} />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Transactions"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Transaction History
                                </h1>
                                <p className="text-sm text-[#9A9A9A] mt-1">
                                    View all financial activities and changes
                                </p>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                    <p className="text-xs text-[#9A9A9A]">Total Transactions</p>
                                    <p className="text-xl font-bold text-white">{summary?.total || 0}</p>
                                </div>
                                <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                    <p className="text-xs text-[#9A9A9A]">Most Common Action</p>
                                    <p className="text-xl font-bold text-white truncate">
                                        {summary?.by_action?.[0]?.action 
                                            ? getActionLabel(summary.by_action[0].action) 
                                            : '—'}
                                    </p>
                                </div>
                                <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                    <p className="text-xs text-[#9A9A9A]">Unique Actions</p>
                                    <p className="text-xl font-bold text-white">{summary?.by_action?.length || 0}</p>
                                </div>
                                <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
                                    <p className="text-xs text-[#9A9A9A]">Latest Activity</p>
                                    <p className="text-xl font-bold text-white">
                                        {transactions.length > 0 ? formatDate(transactions[0].created_at) : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 mb-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Search */}
                                    <div className="flex-1 min-w-[200px]">
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={filters.search || ''}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && fetchTransactions()}
                                            className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                        />
                                    </div>

                                    {/* Action Filter */}
                                    <select
                                        value={filters.action || ''}
                                        onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                        className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                    >
                                        <option value="">All Actions</option>
                                        <option value="deposit">Deposit</option>
                                        <option value="create_pocket">Create Pocket</option>
                                        <option value="update_pocket">Update Pocket</option>
                                        <option value="archive_pocket">Archive Pocket</option>
                                        <option value="delete_pocket">Delete Pocket</option>
                                        <option value="restore_pocket">Restore Pocket</option>
                                        <option value="refund_pocket">Refund Pocket</option>
                                        <option value="allocate_funds">Allocate Funds</option>
                                        <option value="transfer_funds">Transfer Funds</option>
                                        <option value="create_expense">Create Expense</option>
                                        <option value="update_expense">Update Expense</option>
                                        <option value="delete_expense">Delete Expense</option>
                                        <option value="archive_expense">Archive Expense</option>
                                        <option value="restore_expense">Restore Expense</option>
                                    </select>

                                    {/* Date Range */}
                                    <select
                                        value={filters.date_range || 'this_month'}
                                        onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
                                        className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                    >
                                        <option value="today">Today</option>
                                        <option value="this_week">This Week</option>
                                        <option value="this_month">This Month</option>
                                        <option value="last_3_months">Last 3 Months</option>
                                    </select>

                                    {/* Sort By */}
                                    <select
                                        value={filters.sort_by || 'newest'}
                                        onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
                                        className="px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors text-sm"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>

                                    {/* Apply & Reset */}
                                    <button
                                        onClick={() => fetchTransactions()}
                                        className="px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors text-sm"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Transactions Table */}
                            <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#242424]">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Action</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Table</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">Details</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[#9A9A9A] uppercase tracking-wider">IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#242424]">
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-8 text-center text-[#9A9A9A]">
                                                        No transactions found
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction: any) => (
                                                    <tr key={transaction.id} className="hover:bg-[#171717] transition-colors">
                                                        <td className="px-4 py-3 text-sm text-[#9A9A9A] whitespace-nowrap">
                                                            {formatDate(transaction.created_at)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`text-xs px-2 py-1 rounded-full ${getActionBadgeColor(transaction.action)}`}>
                                                                {getActionLabel(transaction.action)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[#9A9A9A]">
                                                            {transaction.table_name || '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[#9A9A9A] max-w-[200px] truncate">
                                                            {transaction.old_values && transaction.new_values ? (
                                                                <span title={`From: ${transaction.old_values} → To: ${transaction.new_values}`}>
                                                                    Changed values
                                                                </span>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[#9A9A9A]">
                                                            {transaction.ip_address || '—'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
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
                                        {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => i + 1).map((page) => (
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
                                        ))}
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
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}