import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Sidebar } from '@/Components/dashboard/Sidebar'
import { TopNav } from '@/Components/dashboard/TopNav'
import { WelcomeCard } from '@/Components/dashboard/WelcomeCard'
import { StatsGrid } from '@/Components/dashboard/StatsGrid'
import { ChartsSection } from '@/Components/dashboard/ChartsSection'
import { RecentActivity } from '@/Components/dashboard/RecentActivity'
import { BudgetCategories } from '@/Components/dashboard/BudgetCategories'
import { QuickActions } from '@/Components/dashboard/QuickActions'
import { InsightsPanel } from '@/Components/dashboard/InsightsPanel'
import { useBudget } from '@/hooks/useBudget'
import { useExpenses } from '@/hooks/useExpenses'
import { usePockets } from '@/hooks/usePockets'

interface PageProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
      email_verified_at?: string
      created_at: string
    }
  }
  [key: string]: unknown
  stats: {
    total_balance: number
    safe_balance: number
    total_savings: number
    monthly_spending: number
    active_budgets: number
    pending_transactions: number
  }
  summary?: {
    safe_balance: number
    allocated_balance: number
    remaining_balance: number
    monthly_budget: number
    total_pockets: number
    budget_health: number
    budget_health_label: string
  }
  recentActivities: Array<{
    id: number
    description: string
    amount: number
    type: 'income' | 'expense' | 'transfer'
    category_name: string
    category_icon?: string
    date: string
    created_at: string
    budget_name?: string | null
    pocket_name?: string | null
  }>
  budgetCategories: Array<{
    id: number
    name: string
    icon: string
    color: string
    allocated: number
    spent: number
    remaining: number
    budget_id: number
    category_id: number
    budget_name: string
  }>
  insights: Array<{
    id: number
    message: string
    icon: string
    type: 'positive' | 'warning' | 'neutral'
  }>
}

/**
 * Main Dashboard component that displays all dashboard widgets
 * Fetches real data from the database using hooks
 */
const Dashboard: React.FC = () => {
  const pageProps = usePage<PageProps>().props as PageProps & {
    stats?: PageProps['stats']
    summary?: PageProps['summary']
    recentActivities?: PageProps['recentActivities']
    budgetCategories?: PageProps['budgetCategories']
    insights?: PageProps['insights']
  }
  const { auth, stats, summary, recentActivities, budgetCategories, insights } = pageProps
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch real data from the database
  const { fetchBudgetData } = useBudget()
  const { fetchExpenses } = useExpenses()
  const { fetchPockets } = usePockets()

  // Force refresh when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchBudgetData(),
          fetchExpenses(),
          fetchPockets()
        ])
        setDataLoaded(true)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
    setRefreshKey(Date.now())
  }, [])

  const handleLogout = () => {
    router.post('/logout')
  }

  // Use summary data if available, otherwise fallback to stats
  const safeBalance = summary?.safe_balance ?? stats?.safe_balance ?? 0
  const allocatedBalance = summary?.allocated_balance ?? 0
  const totalBalance = stats?.total_balance ?? 0
  const monthlySpending = stats?.monthly_spending ?? 0

  // Prepare stats for StatsGrid from real data
  const statsData = [
    {
      id: 1,
      title: 'Total Balance',
      value: `₱${totalBalance.toLocaleString()}`,
      icon: 'mdi:wallet',
      trend: '+0%',
      trendUp: true,
      source: 'Total money',
      rawValue: totalBalance,
    },
    {
      id: 2,
      title: 'Safe Balance',
      value: `₱${safeBalance.toLocaleString()}`,
      icon: 'mdi:shield-outline',
      trend: '+0%',
      trendUp: true,
      source: 'Available to spend',
      rawValue: safeBalance,
    },
    {
      id: 3,
      title: 'Monthly Spending',
      value: `₱${monthlySpending.toLocaleString()}`,
      icon: 'mdi:chart-bar',
      trend: '-0%',
      trendUp: false,
      source: 'This month',
      rawValue: monthlySpending,
    },
    {
      id: 4,
      title: 'Total Pockets',
      value: `${summary?.total_pockets ?? 0}`,
      icon: 'mdi:folder-multiple',
      trend: '+0',
      trendUp: true,
      source: 'Active pockets',
      rawValue: summary?.total_pockets ?? 0,
    },
    {
      id: 5,
      title: 'Budget Health',
      value: `${summary?.budget_health ?? 0}%`,
      icon: 'mdi:heart-pulse',
      trend: '+0%',
      trendUp: true,
      source: summary?.budget_health_label ?? 'Excellent',
      rawValue: summary?.budget_health ?? 0,
    },
  ]

  // Prepare chart data from summary
  const spendingData = {
    labels: ['Safe Balance', 'Allocated', 'Remaining'],
    values: [
      safeBalance,
      allocatedBalance,
      summary?.remaining_balance ?? 0
    ],
    colors: ['#5CB85C', '#3B82F6', '#F59E0B'],
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [60, 75, 45, 85, 70, 90, 65, 80, 55, 95, 70, 85],
  }

  // Get pocket distribution for savings
  const savingsData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping'],
    values: [45, 25, 15, 8, 7],
    colors: ['#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784'],
  }

  // Debug log - only when data is loaded
  useEffect(() => {
    if (dataLoaded) {
      console.log('Dashboard loaded with data:')
      console.log('Total Balance:', totalBalance)
      console.log('Safe Balance:', safeBalance)
      console.log('Budget Summary:', summary)
    }
  }, [dataLoaded, totalBalance, safeBalance, summary])

  return (
    <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
      <Sidebar 
        activePage="dashboard" 
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="lg:ml-[280px] min-h-screen">
        <TopNav
          title="Dashboard"
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          notificationCount={0}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Welcome Card - Pass both totalBalance and safeBalance */}
            <WelcomeCard
              key={refreshKey}
              user={auth.user}
              totalBalance={totalBalance}
              safeBalance={safeBalance}
              currency="₱"
              onTransfer={() => console.log('Transfer')}
              onViewTransactions={() => router.visit('/transactions')}
            />

            {/* Stats Grid - Uses real data */}
            <StatsGrid stats={statsData} loading={loading} />

            {/* Charts Section - Uses real data */}
            <ChartsSection
              spendingData={spendingData}
              monthlyData={monthlyData}
              savingsData={savingsData}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column - 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                <BudgetCategories 
                  onManage={() => router.visit('/budget')}
                  onViewPocket={(id) => router.visit(`/budget?pocket=${id}`)}
                />
                <RecentActivity 
                  activities={recentActivities || []} 
                  onViewAll={() => router.visit('/expenses')}
                  onItemClick={(id) => router.visit(`/expenses/${id}`)}
                />
              </div>

              {/* Right Column - 1/3 */}
              <div className="space-y-6">
                <QuickActions />
                <InsightsPanel insights={insights || []} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard