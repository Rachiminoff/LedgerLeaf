import React, { useState, useEffect } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import { Sidebar } from '@/Components/Dashboard/Sidebar'
import { TopNav } from '@/Components/Dashboard/TopNav'
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
}

export default function SavingsIndex() {
    const { auth, goals, summary, recent_transactions } = usePage<PageProps>().props
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<any>(null)
    const [editingGoal, setEditingGoal] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const isMobile = useMediaQuery('(max-width: 768px)')

    const {
        fetchGoals,
        createGoal,
        updateGoal,
        archiveGoal,
        deleteGoal,
        depositFunds,
        withdrawFunds,
    } = useSavings()

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleLogout = () => {
        router.post('/logout')
    }

    const handleCreateGoal = async (data: any) => {
        try {
            setLoading(true)
            await createGoal(data)
            toastSuccess('Savings goal created successfully! 🎯')
            setIsGoalModalOpen(false)
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to create goal')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateGoal = async (data: any) => {
        try {
            setLoading(true)
            await updateGoal(selectedGoal.id, data)
            toastSuccess('Goal updated successfully! ✏️')
            setIsGoalModalOpen(false)
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to update goal')
        } finally {
            setLoading(false)
        }
    }

    const handleDeposit = async (data: any) => {
        try {
            setLoading(true)
            await depositFunds(selectedGoal.id, data)
            toastSuccess(`Deposited ₱${data.amount.toFixed(2)} successfully! 💰`)
            setIsDepositModalOpen(false)
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to deposit')
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async (data: any) => {
        try {
            setLoading(true)
            await withdrawFunds(selectedGoal.id, data)
            toastSuccess(`Withdrew ₱${data.amount.toFixed(2)} successfully! 💳`)
            setIsWithdrawModalOpen(false)
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to withdraw')
        } finally {
            setLoading(false)
        }
    }

    const handleArchive = async (id: number) => {
        try {
            await archiveGoal(id)
            toastSuccess('Goal archived successfully! 📦')
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to archive goal')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteGoal(id)
            toastSuccess('Goal deleted successfully! 🗑️')
            fetchGoals()
        } catch (err: any) {
            toastError(err.message || 'Failed to delete goal')
        }
    }

    const handleViewGoal = (goal: any) => {
        setSelectedGoal(goal)
        setIsDetailsModalOpen(true)
    }

    const handleEditGoal = (goal: any) => {
        setSelectedGoal(goal)
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

    const handleArchiveWithConfirm = (id: number) => {
        if (confirm('Are you sure you want to archive this goal?')) {
            handleArchive(id)
        }
    }

    const handleDeleteWithConfirm = (id: number) => {
        if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
            handleDelete(id)
        }
    }

    const activeGoals = goals.filter((g: any) => !g.is_archived)

    return (
        <>
            <Head title="Savings | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar activePage="savings" onLogout={handleLogout} />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Savings"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header */}
                            <SavingsHeader />

                            {/* Summary */}
                            <SavingsSummary summary={summary} />

                            {/* Main Grid */}
                            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6 mt-6`}>
                                {/* Left Column - 2/3 */}
                                <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} space-y-6`}>
                                    {activeGoals.length === 0 ? (
                                        <EmptyState onCreateGoal={() => setIsGoalModalOpen(true)} />
                                    ) : (
                                        <SavingsGoalList
                                            goals={activeGoals}
                                            onViewGoal={handleViewGoal}
                                            onEditGoal={handleEditGoal}
                                            onArchiveGoal={handleArchiveWithConfirm}
                                            onDeleteGoal={handleDeleteWithConfirm}
                                            onDeposit={handleDepositClick}
                                            onWithdraw={handleWithdrawClick}
                                        />
                                    )}
                                </div>

                                {/* Right Column - 1/3 */}
                                <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} space-y-6`}>
                                    <SavingsStats goals={goals} />
                                    <SavingsInsights goals={goals} summary={summary} />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Modals */}
                <GoalModal
                    isOpen={isGoalModalOpen}
                    onClose={() => setIsGoalModalOpen(false)}
                    onSave={selectedGoal ? handleUpdateGoal : handleCreateGoal}
                    mode={selectedGoal ? 'edit' : 'create'}
                    goal={selectedGoal}
                    loading={loading}
                />

                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                    onDeposit={handleDeposit}
                    goal={selectedGoal}
                    safeBalance={summary.safe_balance}
                    loading={loading}
                />

                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    onWithdraw={handleWithdraw}
                    goal={selectedGoal}
                    loading={loading}
                />

                <GoalDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
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
            </div>
        </>
    )
}