import React, { useState, useEffect } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import { Sidebar } from '@/Components/dashboard/Sidebar'
import { TopNav } from '@/Components/dashboard/TopNav'
import AnalyticsHeader from '@/Components/analytics/AnalyticsHeader'
import AnalyticsFilters from '@/Components/analytics/AnalyticsFilters'
import FinancialOverview from '@/Components/analytics/FinancialOverview'
import SpendingTrend from '@/Components/analytics/SpendingTrend'
import MonthlyComparison from '@/Components/analytics/MonthlyComparison'
import PocketBreakdown from '@/Components/analytics/PocketBreakdown'
import SavingsPerformance from '@/Components/analytics/SavingsPerformance'
import FinancialInsights from '@/Components/analytics/FinancialInsights'
import QuickStatistics from '@/Components/analytics/QuickStatistics'
import AnalyticsExport from '@/Components/analytics/AnalyticsExport'
import EmptyState from '@/Components/analytics/EmptyState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SkeletonCard, SkeletonChart } from '@/Components/ui/skeleton'
import { toastError } from '@/Components/ui/Toast'

interface PageProps {
    auth: {
        user: {
            id: number
            name: string
            email: string
            email_verified_at?: string
        }
    }
    [key: string]: unknown
}

export default function AnalyticsIndex() {
    const { auth } = usePage<PageProps>().props
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [period, setPeriod] = useState('this_month')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [hasData, setHasData] = useState(false)

    const isMobile = useMediaQuery('(max-width: 768px)')

    const {
        overview,
        spendingTrend,
        monthlyComparison,
        pocketBreakdown,
        savingsPerformance,
        insights,
        quickStats,
        loading,
        fetchAnalytics,
        exporting,
        exportData,
    } = useAnalytics()

    useEffect(() => {
        loadData()
    }, [period, startDate, endDate])

    const loadData = async () => {
        try {
            await fetchAnalytics({ period, start_date: startDate, end_date: endDate })
            setHasData(true)
        } catch (error) {
            toastError('Failed to load analytics data')
        }
    }

    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod)
        if (newPeriod !== 'custom') {
            setStartDate('')
            setEndDate('')
        }
    }

    const handleCustomDateChange = (start: string, end: string) => {
        setStartDate(start)
        setEndDate(end)
    }

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        try {
            await exportData(format, { period, start_date: startDate, end_date: endDate })
        } catch (error) {
            toastError(`Failed to export as ${format.toUpperCase()}`)
        }
    }

    const handleLogout = () => {
        router.post('/logout')
    }

    // Check if there's any data to display
    const hasOverviewData = Boolean(
        overview && (
            Number(overview.income ?? 0) > 0 ||
            Number(overview.expenses ?? 0) > 0 ||
            Number(overview.savings ?? 0) > 0
        )
    )

    return (
        <>
            <Head title="Analytics | LedgerLeaf" />

            <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
                <Sidebar 
                    activePage="analytics" 
                    onLogout={handleLogout}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                />

                <div className="lg:ml-[280px] min-h-screen">
                    <TopNav
                        title="Analytics"
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        notificationCount={0}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {/* Header */}
                            <AnalyticsHeader />

                            {/* Filters */}
                            <AnalyticsFilters
                                period={period}
                                onPeriodChange={handlePeriodChange}
                                startDate={startDate}
                                endDate={endDate}
                                onCustomDateChange={handleCustomDateChange}
                                loading={loading}
                            />

                            {loading ? (
                                <div className="space-y-6 mt-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <SkeletonCard key={i} />
                                        ))}
                                    </div>
                                    <SkeletonChart />
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2">
                                            <SkeletonChart />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <SkeletonCard count={3} />
                                        </div>
                                    </div>
                                </div>
                            ) : !hasOverviewData ? (
                                <EmptyState />
                            ) : (
                                <>
                                    {/* Financial Overview */}
                                    <FinancialOverview overview={overview} />

                                    {/* Main Grid */}
                                    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6 mt-6`}>
                                        {/* Left Column - 2/3 */}
                                        <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} space-y-6`}>
                                            <SpendingTrend data={spendingTrend} />
                                            <MonthlyComparison data={monthlyComparison} />
                                        </div>

                                        {/* Right Column - 1/3 */}
                                        <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} space-y-6`}>
                                            <PocketBreakdown data={pocketBreakdown} />
                                            <SavingsPerformance data={savingsPerformance} />
                                        </div>
                                    </div>

                                    {/* Insights and Quick Stats */}
                                    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6 mt-6`}>
                                        <div className={`${isMobile ? 'col-span-1' : 'col-span-2'}`}>
                                            <FinancialInsights insights={insights} />
                                        </div>
                                        <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>
                                            <QuickStatistics stats={quickStats} />
                                        </div>
                                    </div>

                                    {/* Export */}
                                    <div className="mt-6">
                                        <AnalyticsExport
                                            onExport={handleExport}
                                            loading={exporting}
                                            period={period}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}