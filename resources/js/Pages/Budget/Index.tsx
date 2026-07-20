/**
 * Budget Planner Index Page
 * 
 * This component serves as the main entry point for the Budget Planner module.
 * It displays budget overview, pocket management, allocation tracking, and
 * provides CRUD operations for budget management.
 * 
 * @package LedgerLeaf
 * @subpackage Resources/js/Pages/Budget
 */

import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { toastSuccess, toastError, toastWarning } from '@/Components/ui/Toast';
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

/**
 * Page properties received from the server.
 */
interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

/**
 * Confirmation modal configuration.
 */
interface ConfirmModalConfig {
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'danger' | 'warning' | 'info';
    confirmText: string;
}

/**
 * BudgetIndex Component
 * 
 * Renders the Budget Planner page with all sub-components and manages
 * the state for budget operations.
 * 
 * @returns {JSX.Element} The rendered Budget Planner page.
 */
export default function BudgetIndex(): JSX.Element {
    // ─── Props ──────────────────────────────────────────────────────
    const { auth } = usePage<PageProps>().props;

    // ─── State ──────────────────────────────────────────────────────
    /** Controls mobile sidebar visibility. */
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    
    /** Controls pocket creation/editing modal visibility. */
    const [isPocketModalOpen, setIsPocketModalOpen] = useState<boolean>(false);
    
    /** Controls allocate funds modal visibility. */
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState<boolean>(false);
    
    /** Controls transfer funds modal visibility. */
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    
    /** The pocket currently being edited. */
    const [editingPocket, setEditingPocket] = useState<any>(null);
    
    /** The ID of the selected pocket for allocation. */
    const [selectedPocketId, setSelectedPocketId] = useState<number | null>(null);
    
    /** Determines whether the modal is in create or edit mode. */
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    
    /** The user's current safe balance. */
    const [safeBalance, setSafeBalance] = useState<number>(0);

    /**
     * Confirmation modal state for destructive actions.
     * Used for archive and delete confirmations.
     */
    const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>({
        isOpen: false,
        title: '',
        message: '',
        action: () => {},
        type: 'danger',
        confirmText: 'Confirm',
    });

    /** Determines if the current viewport is mobile size. */
    const isMobile = useMediaQuery('(max-width: 768px)');

    // ─── Hooks ──────────────────────────────────────────────────────

    /**
     * Budget management hook providing budget data and operations.
     */
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

    /**
     * Pocket management hook providing pocket data and operations.
     */
    const {
        pockets,
        filters,
        setFilters,
        resetFilters,
        fetchPockets,
    } = usePockets();

    // ─── Effects ────────────────────────────────────────────────────

    /**
     * Fetch budget data and pockets when filters change.
     */
    useEffect((): void => {
        fetchBudgetData();
        fetchPockets(filters);
    }, [filters]);

    /**
     * Update safeBalance when the summary data changes.
     */
    useEffect((): void => {
        if (summary?.safe_balance !== undefined && summary?.safe_balance !== null) {
            setSafeBalance(Number(summary.safe_balance));
        }
    }, [summary]);

    // ─── Event Handlers ─────────────────────────────────────────────

    /**
     * Opens the pocket creation modal.
     * 
     * @returns {void}
     */
    const handleCreatePocket = (): void => {
        setEditingPocket(null);
        setModalMode('create');
        setIsPocketModalOpen(true);
    };

    /**
     * Opens the pocket edit modal with the selected pocket data.
     * 
     * @param {any} pocket - The pocket to edit.
     * @returns {void}
     */
    const handleEditPocket = (pocket: any): void => {
        setEditingPocket(pocket);
        setModalMode('edit');
        setIsPocketModalOpen(true);
    };

    /**
     * Saves a pocket (create or update).
     * 
     * @param {any} data - The pocket data to save.
     * @returns {Promise<void>}
     */
    const handleSavePocket = async (data: any): Promise<void> => {
        try {
            if (modalMode === 'create') {
                await createPocket(data);
                toastSuccess('Pocket created successfully!');
            } else {
                await updatePocket(editingPocket!.id, data);
                toastSuccess('Pocket updated successfully!');
            }
            
            setIsPocketModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            toastError(err.message || 'Failed to save pocket');
            console.error('Failed to save pocket:', err);
        }
    };

    /**
     * Archives a pocket with confirmation.
     * Refunds any remaining balance to safe balance.
     * 
     * @param {number} id - The ID of the pocket to archive.
     * @returns {Promise<void>}
     */
    const handleArchivePocket = async (id: number): Promise<void> => {
        const pocket = pockets.find((p: any) => p.id === id);
        const refundAmount = pocket?.allocated - pocket?.spent;
        
        setConfirmModal({
            isOpen: true,
            title: 'Archive Pocket',
            message: `Are you sure you want to archive "${pocket?.name}"?${refundAmount > 0 ? `\n\n💰 ₱${refundAmount.toFixed(2)} will be refunded to your safe balance.` : ''}`,
            type: 'warning',
            confirmText: 'Archive',
            action: async (): Promise<void> => {
                try {
                    await archivePocket(id);
                    toastSuccess('Pocket archived successfully!');
                    fetchPockets(filters);
                    fetchBudgetData();
                } catch (err: any) {
                    toastError(err.message || 'Failed to archive pocket');
                }
            },
        });
    };

    /**
     * Permanently deletes a pocket with confirmation.
     * Refunds any remaining balance to safe balance.
     * 
     * @param {number} id - The ID of the pocket to delete.
     * @returns {Promise<void>}
     */
    const handleDeletePocket = async (id: number): Promise<void> => {
        const pocket = pockets.find((p: any) => p.id === id);
        const refundAmount = pocket?.allocated - pocket?.spent;
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Pocket',
            message: `Are you sure you want to permanently delete "${pocket?.name}"?${refundAmount > 0 ? `\n\n💰 ₱${refundAmount.toFixed(2)} will be refunded to your safe balance.` : ''}`,
            type: 'danger',
            confirmText: 'Delete',
            action: async (): Promise<void> => {
                try {
                    await deletePocket(id);
                    toastSuccess('Pocket deleted successfully!');
                    fetchPockets(filters);
                    fetchBudgetData();
                } catch (err: any) {
                    toastError(err.message || 'Failed to delete pocket');
                }
            },
        });
    };

    /**
     * Allocates funds to a specific pocket.
     * 
     * @param {number} pocketId - The ID of the pocket to allocate to.
     * @param {number} amount - The amount to allocate.
     * @returns {Promise<void>}
     */
    const handleAllocateFunds = async (pocketId: number, amount: number): Promise<void> => {
        try {
            await allocateFunds(pocketId, amount);
            toastSuccess(`₱${amount.toFixed(2)} allocated successfully!`);
            setIsAllocateModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            toastError(err.message || 'Failed to allocate funds');
        }
    };

    /**
     * Transfers funds between two pockets.
     * 
     * @param {number} fromPocketId - The source pocket ID.
     * @param {number} toPocketId - The destination pocket ID.
     * @param {number} amount - The amount to transfer.
     * @returns {Promise<void>}
     */
    const handleTransferFunds = async (
        fromPocketId: number, 
        toPocketId: number, 
        amount: number
    ): Promise<void> => {
        try {
            await transferFunds(fromPocketId, toPocketId, amount);
            toastSuccess(`₱${amount.toFixed(2)} transferred successfully!`);
            setIsTransferModalOpen(false);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            toastError(err.message || 'Failed to transfer funds');
        }
    };

    /**
     * Refunds a pocket's remaining balance to safe balance.
     * 
     * @param {number} pocketId - The ID of the pocket to refund.
     * @param {number} amount - The amount to refund.
     * @returns {Promise<void>}
     */
    const handleRefundPocket = async (pocketId: number, amount: number): Promise<void> => {
        try {
            await refundPocket(pocketId);
            toastSuccess(`₱${amount.toFixed(2)} refunded to safe balance!`);
            fetchPockets(filters);
            fetchBudgetData();
        } catch (err: any) {
            toastError(err.message || 'Failed to refund pocket');
        }
    };

    /**
     * Handles user logout.
     * 
     * @returns {void}
     */
    const handleLogout = (): void => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    // ─── Render ─────────────────────────────────────────────────────

    /**
     * Render loading state while data is being fetched.
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar 
                    activePage="budget" 
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />
                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav 
                        title="Budget Planner" 
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        notificationCount={0} 
                    />
                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <SkeletonCard count={4} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
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

    /**
     * Render the main Budget Planner page.
     */
    return (
        <>
            <Head title="Budget Planner | LedgerLeaf" />
            
            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                {/* Sidebar Navigation */}
                <Sidebar 
                    activePage="budget" 
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-[280px] min-h-screen">
                    {/* Top Navigation Bar */}
                    <TopNav
                        title="Budget Planner"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    {/* Main Content */}
                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Page Header */}
                            <BudgetHeader />

                            {/* Quick Action Buttons */}
                            <QuickActions
                                onCreatePocket={handleCreatePocket}
                                onAllocateFunds={() => setIsAllocateModalOpen(true)}
                                onTransferFunds={() => setIsTransferModalOpen(true)}
                            />

                            {/* Summary Statistics Cards */}
                            <BudgetSummaryCards summary={summary} loading={loading} />

                            {/* Main Content Grid - Mobile Optimized */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                                {/* Left Column - Pocket Management */}
                                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                                    {/* Safe Balance Card */}
                                    <SafeBalanceCard
                                        safeBalance={safeBalance}
                                        onAllocate={() => setIsAllocateModalOpen(true)}
                                    />

                                    {/* Budget Filters */}
                                    <BudgetFilters
                                        filters={filters}
                                        onFilterChange={setFilters}
                                        onReset={resetFilters}
                                    />

                                    {/* Pocket List or Empty State */}
                                    {pockets.length === 0 ? (
                                        <EmptyState onCreatePocket={handleCreatePocket} />
                                    ) : (
                                        <PocketList
                                            pockets={pockets}
                                            onEdit={handleEditPocket}
                                            onArchive={handleArchivePocket}
                                            onDelete={handleDeletePocket}
                                            onAllocate={(id: number) => {
                                                setSelectedPocketId(id);
                                                setIsAllocateModalOpen(true);
                                            }}
                                            onRefund={handleRefundPocket}
                                        />
                                    )}
                                </div>

                                {/* Right Column - Insights & Charts (Desktop Only) */}
                                {!isMobile && (
                                    <div className="space-y-4 md:space-y-6">
                                        <BudgetHealthWidget health={summary?.budget_health || 0} />
                                        <AllocationChart pockets={pockets} />
                                        <BudgetInsights insights={insights} />
                                        <RecentActivity activities={recentActivity} />
                                    </div>
                                )}
                            </div>

                            {/* Mobile Stats & Insights (Shown Below Content on Mobile) */}
                            {isMobile && (
                                <div className="mt-4 md:mt-6 space-y-4">
                                    <BudgetHealthWidget health={summary?.budget_health || 0} />
                                    <AllocationChart pockets={pockets} />
                                    <BudgetInsights insights={insights} />
                                    <RecentActivity activities={recentActivity} />
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* ─── Modals ────────────────────────────────────────── */}

                {/* Pocket Creation/Edit Modal */}
                <PocketModal
                    isOpen={isPocketModalOpen}
                    onClose={() => {
                        setIsPocketModalOpen(false);
                    }}
                    onSave={handleSavePocket}
                    mode={modalMode}
                    pocket={editingPocket}
                    safeBalance={safeBalance}
                />

                {/* Allocate Funds Modal */}
                <AllocateFundsModal
                    isOpen={isAllocateModalOpen}
                    onClose={() => {
                        setIsAllocateModalOpen(false);
                    }}
                    onAllocate={handleAllocateFunds}
                    pockets={pockets}
                    selectedPocketId={selectedPocketId}
                    safeBalance={safeBalance}
                />

                {/* Transfer Funds Modal */}
                <TransferFundsModal
                    isOpen={isTransferModalOpen}
                    onClose={() => {
                        setIsTransferModalOpen(false);
                    }}
                    onTransfer={handleTransferFunds}
                    pockets={pockets}
                />

                {/* Confirmation Modal for Destructive Actions */}
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