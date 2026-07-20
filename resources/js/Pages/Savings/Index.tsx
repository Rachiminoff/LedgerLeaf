import React, { useState, useEffect } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import { Sidebar } from '@/Components/dashboard/Sidebar'
import { TopNav } from '@/Components/dashboard/TopNav'
import SavingsHeader from '@/Components/savings/SavingsHeader'
import SavingsSummary from '@/Components/savings/SavingsSummary'
import SavingsGoalList from '@/Components/savings/SavingsGoalList'
import SavingsStats from '@/Components/savings/SavingsStats'
import SavingsInsights from '@/Components/savings/SavingsInsights'
import GoalModal from '@/Components/savings/GoalModal'
import DepositModal from '@/Components/savings/DepositModal'
import WithdrawModal from '@/Components/savings/WithdrawModal'
import GoalDetailsModal from '@/Components/savings/GoalDetailsModal'
import EmptyState from '@/Components/savings/EmptyState'
import ConfirmModal from '@/Components/ui/ConfirmModal'
import { useSavings } from '@/hooks/useSavings'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { toastSuccess, toastError, toastWarning } from '@/Components/ui/Toast'

interface PageProps {
    auth: {
        user: {
            id: number
            name: string
            email: string
        }
    }
    goals: any[]
    summary: {
        safe_balance: number
        total_saved: number
        active_goals: number
        completed_goals: number
    }
    recent_transactions: any[]
    [key: string]: unknown
}

interface ConfirmModalConfig {
    isOpen: boolean
    title: string
    message: string
    action: () => void
    type: 'danger' | 'warning' | 'info'
    confirmText: string
}

export default function SavingsIndex() {
    const { auth, goals: initialGoals, summary: initialSummary, recent_transactions } = usePage<PageProps>().props
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<any>(null)
    const [editingGoal, setEditingGoal] = useState<any>(null)
    const [localLoading, setLocalLoading] = useState(false)

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>({
        isOpen: false,
        title: '',
        message: '',
        action: () => {},
        type: 'danger',
        confirmText: 'Confirm',
    })

    const isMobile = useMediaQuery('(max-width: 768px)')
    const isTablet = useMediaQuery('(max-width: 1024px)')

    const {
        fetchGoals,
        createGoal,
        updateGoal,
        archiveGoal,
        deleteGoal,
        depositFunds,
        withdrawFunds,
        refundGoalFunds,
        loading: hookLoading,
    } = useSavings()

    const loading = localLoading || hookLoading

    useEffect(() => {
        fetchGoals()
    }, [])

    // ─── Close All Modals ───────────────────────────────────────────
    const closeAllModals = () => {
        setIsGoalModalOpen(false)
        setIsDepositModalOpen(false)
        setIsWithdrawModalOpen(false)
        setIsDetailsModalOpen(false)
        setSelectedGoal(null)
        setEditingGoal(null)
    }

    // ─── Refresh Data ──────────────────────────────────────────────
    const refreshData = async () => {
        await fetchGoals()
        // Reload the page props to get updated summary
        router.reload({ only: ['goals', 'summary', 'recent_transactions'] })
    }

    const handleLogout = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Logout',
            message: 'Are you sure you want to log out?',
            type: 'warning',
            confirmText: 'Logout',
            action: () => {
                setConfirmModal({ ...confirmModal, isOpen: false })
                router.post('/logout')
            },
        })
    }

    const handleCreateGoal = async (data: any) => {
        try {
            setLocalLoading(true)
            await createGoal(data)
            toastSuccess('Savings goal created successfully!')
            setIsGoalModalOpen(false)
            setSelectedGoal(null)
            await refreshData()
        } catch (err: any) {
            toastError(err.message || 'Failed to create goal')
        } finally {
            setLocalLoading(false)
        }
    }

    const handleUpdateGoal = async (data: any) => {
        try {
            setLocalLoading(true)
            await updateGoal(selectedGoal.id, data)
            toastSuccess('Goal updated successfully!')
            setIsGoalModalOpen(false)
            setSelectedGoal(null)
            await refreshData()
        } catch (err: any) {
            toastError(err.message || 'Failed to update goal')
        } finally {
            setLocalLoading(false)
        }
    }

    const handleDeposit = async (data: any) => {
        try {
            setLocalLoading(true)
            await depositFunds(selectedGoal.id, data)
            toastSuccess(`Deposited ₱${parseFloat(data.amount).toFixed(2)} successfully!`)
            setIsDepositModalOpen(false)
            setSelectedGoal(null)
            await refreshData()
        } catch (err: any) {
            toastError(err.message || 'Failed to deposit')
        } finally {
            setLocalLoading(false)
        }
    }

    const handleWithdraw = async (data: any) => {
        try {
            setLocalLoading(true)
            await withdrawFunds(selectedGoal.id, data)
            toastSuccess(`Withdrew ₱${parseFloat(data.amount).toFixed(2)} successfully!`)
            setIsWithdrawModalOpen(false)
            setSelectedGoal(null)
            await refreshData()
        } catch (err: any) {
            toastError(err.message || 'Failed to withdraw')
        } finally {
            setLocalLoading(false)
        }
    }

    const handleArchive = (id: number) => {
        const goal = initialGoals.find((g: any) => g.id === id)
        setConfirmModal({
            isOpen: true,
            title: 'Archive Goal',
            message: `Are you sure you want to archive "${goal?.name}"? Archived goals will be hidden from your active list but can be restored later.`,
            type: 'warning',
            confirmText: 'Archive',
            action: async () => {
                setConfirmModal({ ...confirmModal, isOpen: false })
                try {
                    await archiveGoal(id)
                    toastSuccess('Goal archived successfully!')
                    await refreshData()
                } catch (err: any) {
                    toastError(err.message || 'Failed to archive goal')
                }
            },
        })
    }

    const handleDelete = (id: number) => {
        const goal = initialGoals.find((g: any) => g.id === id)
        // Convert to number and handle null/undefined
        const currentAmount = parseFloat(goal?.current_amount) || 0
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Goal',
            message: `Are you sure you want to permanently delete "${goal?.name}"?${
                currentAmount > 0 
                    ? `\n\n💰 ₱${currentAmount.toFixed(2)} will be refunded to your Safe Balance.` 
                    : ''
            }${currentAmount === 0 ? '\n\nThis action cannot be undone.' : ''}`,
            type: 'danger',
            confirmText: 'Delete',
            action: async () => {
                setConfirmModal({ ...confirmModal, isOpen: false })
                try {
                    // First refund the funds if there's any money in the goal
                    if (currentAmount > 0) {
                        await refundGoalFunds(id, currentAmount)
                        toastSuccess(`₱${currentAmount.toFixed(2)} refunded to Safe Balance`)
                    }
                    
                    // Then delete the goal
                    await deleteGoal(id)
                    toastSuccess('Goal deleted successfully!')
                    await refreshData()
                } catch (err: any) {
                    toastError(err.message || 'Failed to delete goal')
                }
            },
        })
    }

    const handleViewGoal = (goal: any) => {
        setSelectedGoal(goal)
        setIsDetailsModalOpen(true)
    }

    const handleEditGoal = (goal: any) => {
        setSelectedGoal(goal)
        setEditingGoal(goal)
        setIsGoalModalOpen(true)
    }

    const handleDepositClick = (goal: any) => {
        setSelectedGoal(goal)
        setIsDepositModalOpen(true)
    }

    const handleWithdrawClick = (goal: any) => {
        setSelectedGoal(goal)
        setIsWithdrawModalOpen(true)
    }

    const activeGoals = initialGoals.filter((g: any) => !g.is_archived)

    return (
        <>
            <Head title="Savings | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar 
                    activePage="savings" 
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Savings"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header - Mobile optimized with Create Goal button */}
                            <SavingsHeader onCreateGoal={() => setIsGoalModalOpen(true)} />

                            {/* Summary - Mobile optimized grid */}
                            <SavingsSummary summary={initialSummary} />

                            {/* Main Grid - Mobile optimized */}
                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-4 md:gap-6 mt-4 md:mt-6`}>
                                {/* Left Column - Goal List */}
                                <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-2'} space-y-4 md:space-y-6`}>
                                    {activeGoals.length === 0 ? (
                                        <EmptyState onCreateGoal={() => setIsGoalModalOpen(true)} />
                                    ) : (
                                        <SavingsGoalList
                                            goals={activeGoals}
                                            onViewGoal={handleViewGoal}
                                            onEditGoal={handleEditGoal}
                                            onArchiveGoal={handleArchive}
                                            onDeleteGoal={handleDelete}
                                            onDeposit={handleDepositClick}
                                            onWithdraw={handleWithdrawClick}
                                            isMobile={isMobile}
                                        />
                                    )}
                                </div>

                                {/* Right Column - Stats & Insights */}
                                {!isMobile && (
                                    <div className="lg:col-span-1 space-y-4 md:space-y-6">
                                        <SavingsStats goals={initialGoals} />
                                        <SavingsInsights goals={initialGoals} summary={initialSummary} />
                                    </div>
                                )}
                            </div>

                            {/* Mobile Stats & Insights - Shown below the list on mobile */}
                            {isMobile && (
                                <div className="mt-4 md:mt-6 space-y-4">
                                    <SavingsStats goals={initialGoals} />
                                    <SavingsInsights goals={initialGoals} summary={initialSummary} />
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* ─── Modals ────────────────────────────────────────── */}

                {/* Goal Create/Edit Modal */}
                <GoalModal
                    isOpen={isGoalModalOpen}
                    onClose={() => {
                        setIsGoalModalOpen(false)
                        setSelectedGoal(null)
                        setEditingGoal(null)
                    }}
                    onSave={selectedGoal ? handleUpdateGoal : handleCreateGoal}
                    mode={selectedGoal ? 'edit' : 'create'}
                    goal={selectedGoal}
                    loading={loading}
                />

                {/* Deposit Modal */}
                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => {
                        setIsDepositModalOpen(false)
                        setSelectedGoal(null)
                    }}
                    onDeposit={handleDeposit}
                    goal={selectedGoal}
                    safeBalance={initialSummary?.safe_balance || 0}
                    loading={loading}
                />

                {/* Withdraw Modal */}
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => {
                        setIsWithdrawModalOpen(false)
                        setSelectedGoal(null)
                    }}
                    onWithdraw={handleWithdraw}
                    goal={selectedGoal}
                    loading={loading}
                />

                {/* Goal Details Modal */}
                <GoalDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false)
                        setSelectedGoal(null)
                    }}
                    goal={selectedGoal}
                    onDeposit={() => {
                        setIsDetailsModalOpen(false)
                        setIsDepositModalOpen(true)
                    }}
                    onWithdraw={() => {
                        setIsDetailsModalOpen(false)
                        setIsWithdrawModalOpen(true)
                    }}
                    onEdit={() => {
                        setIsDetailsModalOpen(false)
                        setIsGoalModalOpen(true)
                    }}
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
    )
}