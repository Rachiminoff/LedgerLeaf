import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Sidebar } from '@/Components/dashboard/Sidebar';
import { TopNav } from '@/Components/dashboard/TopNav';
import BudgetHeader from '@/Components/budget/BudgetHeader';
import BudgetSummaryCards from '@/Components/budget/BudgetSummaryCards';
import QuickActions from '@/Components/budget/QuickActions';
import SafeBalanceCard from '@/Components/budget/SafeBalanceCard';
import PocketList from '@/Components/budget/PocketList';
import BudgetHealthWidget from '@/Components/budget/BudgetHealthWidget';
import AllocationChart from '@/Components/budget/AllocationChart';
import BudgetInsights from '@/Components/budget/BudgetInsights';
import RecentActivity from '@/Components/budget/RecentActivity';
import BudgetFilters from '@/Components/budget/BudgetFilters';
import EmptyState from '@/Components/budget/EmptyState';
import PocketModal from '@/Components/budget/PocketModal';
import AllocateFundsModal from '@/Components/budget/AllocateFundsModal';
import TransferFundsModal from '@/Components/budget/TransferFundsModal';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { useBudget } from '@/hooks/useBudget';
import { usePockets } from '@/hooks/usePockets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SkeletonCard, SkeletonChart } from '@/Components/ui/skeleton';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function BudgetIndex() {
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPocketModalOpen, setIsPocketModalOpen] = useState(false);
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [editingPocket, setEditingPocket] = useState<any>(null);
    const [selectedPocketId, setSelectedPocketId] = useState<number | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [safeBalance, setSafeBalance] = useState<number>(0);

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
        summary,
        stats,
        insights,
        recentActivity,
        loading,
        fetchBudgetData,
        createPocket,
        updatePocket,
        archivePocket,
        deletePocket,
        allocateFunds,
        transferFunds,
        refundPocket,
    } = useBudget();

    const {
        pockets,
        filters,
        setFilters,
        resetFilters,
        fetchPockets,
    } = usePockets();

    useEffect(() => {
        fetchBudgetData();
        fetchPockets(filters);
    }, [filters]);

    // Update safeBalance when summary changes
    useEffect(() => {
        if (summary?.safe_balance !== undefined && summary?.safe_balance !== null) {
            setSafeBalance(Number(summary.safe_balance));
        }
    }, [summary]);

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

    const handleCreatePocket = () => {
        setEditingPocket(null);
        setModalMode('create');
        setIsPocketModalOpen(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleEditPocket = (pocket: any) => {
        setEditingPocket(pocket);
        setModalMode('edit');
        setIsPocketModalOpen(true);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSavePocket = async (data: any) => {
        try {
            setError(null);
            setSuccessMessage(null);
            
            if (modalMode === 'create') {
                await createPocket(data);
                setSuccessMessage('Pocket created successfully!');
            } else {
                await updatePocket(editingPocket!.id, data);
                setSuccessMessage('Pocket updated successfully!');
            }
            
            setIsPocketModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            setError(err.message || 'Failed to save pocket');
            console.error('Failed to save pocket:', err);
        }
    };

    const handleArchivePocket = async (id: number) => {
        const pocket = pockets.find((p: any) => p.id === id);
        const refundAmount = pocket?.allocated - pocket?.spent;
        
        setConfirmModal({
            isOpen: true,
            title: 'Archive Pocket',
            message: `Are you sure you want to archive "${pocket?.name}"?${refundAmount > 0 ? `\n\n💰 ₱${refundAmount.toFixed(2)} will be refunded to your safe balance.` : ''}`,
            type: 'warning',
            confirmText: 'Archive',
            action: async () => {
                try {
                    await archivePocket(id);
                    setSuccessMessage('Pocket archived successfully!');
                    fetchPockets(filters);
                    fetchBudgetData();
                } catch (err: any) {
                    setError(err.message || 'Failed to archive pocket');
                }
            },
        });
    };

    const handleDeletePocket = async (id: number) => {
        const pocket = pockets.find((p: any) => p.id === id);
        const refundAmount = pocket?.allocated - pocket?.spent;
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Pocket',
            message: `Are you sure you want to permanently delete "${pocket?.name}"?${refundAmount > 0 ? `\n\n💰 ₱${refundAmount.toFixed(2)} will be refunded to your safe balance.` : ''}`,
            type: 'danger',
            confirmText: 'Delete',
            action: async () => {
                try {
                    await deletePocket(id);
                    setSuccessMessage('Pocket deleted successfully!');
                    fetchPockets(filters);
                    fetchBudgetData();
                } catch (err: any) {
                    setError(err.message || 'Failed to delete pocket');
                }
            },
        });
    };

    const handleAllocateFunds = async (pocketId: number, amount: number) => {
        try {
            setError(null);
            setSuccessMessage(null);
            await allocateFunds(pocketId, amount);
            setSuccessMessage(`₱${amount.toFixed(2)} allocated successfully!`);
            setIsAllocateModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            setError(err.message || 'Failed to allocate funds');
        }
    };

    const handleTransferFunds = async (fromPocketId: number, toPocketId: number, amount: number) => {
        try {
            setError(null);
            setSuccessMessage(null);
            await transferFunds(fromPocketId, toPocketId, amount);
            setSuccessMessage(`₱${amount.toFixed(2)} transferred successfully!`);
            setIsTransferModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            setError(err.message || 'Failed to transfer funds');
        }
    };

    const handleRefundPocket = async (pocketId: number, amount: number) => {
        try {
            await refundPocket(pocketId);
            setSuccessMessage(`₱${amount.toFixed(2)} refunded to safe balance!`);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            setError(err.message || 'Failed to refund pocket');
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="budget" onLogout={handleLogout} />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav title="Budget Planner" onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} notificationCount={0} />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <SkeletonCard count={4} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                <div className="lg:col-span-2">
                                    <SkeletonCard count={3} />
                                </div>
                                <div className="lg:col-span-1">
                                    <SkeletonChart />
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
            <Head title="Budget Planner | LedgerLeaf" />
            
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="budget" onLogout={handleLogout} />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Budget Planner"
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
                            <BudgetHeader />

                            {/* Quick Actions */}
                            <QuickActions
                                onCreatePocket={handleCreatePocket}
                                onAllocateFunds={() => setIsAllocateModalOpen(true)}
                                onTransferFunds={() => setIsTransferModalOpen(true)}
                            />

                            {/* Summary Cards */}
                            <BudgetSummaryCards summary={summary} loading={loading} />

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                {/* Left Column - 2/3 */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Safe Balance */}
                                    <SafeBalanceCard
                                        safeBalance={safeBalance}
                                        onAllocate={() => setIsAllocateModalOpen(true)}
                                    />

                                    {/* Filters */}
                                    <BudgetFilters
                                        filters={filters}
                                        onFilterChange={setFilters}
                                        onReset={resetFilters}
                                    />

                                    {/* Pocket List */}
                                    {pockets.length === 0 ? (
                                        <EmptyState onCreatePocket={handleCreatePocket} />
                                    ) : (
                                        <PocketList
                                            pockets={pockets}
                                            onEdit={handleEditPocket}
                                            onArchive={handleArchivePocket}
                                            onDelete={handleDeletePocket}
                                            onAllocate={(id) => {
                                                setSelectedPocketId(id);
                                                setIsAllocateModalOpen(true);
                                            }}
                                            onRefund={handleRefundPocket}
                                        />
                                    )}
                                </div>

                                {/* Right Column - 1/3 */}
                                <div className="space-y-6">
                                    <BudgetHealthWidget health={summary?.budget_health || 0} />
                                    <AllocationChart pockets={pockets} />
                                    <BudgetInsights insights={insights} />
                                    <RecentActivity activities={recentActivity} />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Modals */}
                <PocketModal
                    isOpen={isPocketModalOpen}
                    onClose={() => {
                        setIsPocketModalOpen(false);
                        setError(null);
                    }}
                    onSave={handleSavePocket}
                    mode={modalMode}
                    pocket={editingPocket}
                    safeBalance={safeBalance}
                />

                <AllocateFundsModal
                    isOpen={isAllocateModalOpen}
                    onClose={() => {
                        setIsAllocateModalOpen(false);
                        setError(null);
                    }}
                    onAllocate={handleAllocateFunds}
                    pockets={pockets}
                    selectedPocketId={selectedPocketId}
                    safeBalance={safeBalance}
                />

                <TransferFundsModal
                    isOpen={isTransferModalOpen}
                    onClose={() => {
                        setIsTransferModalOpen(false);
                        setError(null);
                    }}
                    onTransfer={handleTransferFunds}
                    pockets={pockets}
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