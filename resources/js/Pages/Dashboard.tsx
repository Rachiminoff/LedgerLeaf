import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Sidebar } from '@/Components/Dashboard/Sidebar'
import { TopNav } from '@/Components/Dashboard/TopNav'
import { WelcomeCard } from '@/Components/Dashboard/WelcomeCard'
import { StatsGrid } from '@/Components/Dashboard/StatsGrid'
import { ChartsSection } from '@/Components/Dashboard/ChartsSection'
import { RecentActivity } from '@/Components/Dashboard/RecentActivity'
import { BudgetCategories } from '@/Components/Dashboard/BudgetCategories'
import { QuickActions } from '@/Components/Dashboard/QuickActions'
import { InsightsPanel } from '@/Components/Dashboard/InsightsPanel'
import { NotificationsWidget } from '@/Components/Dashboard/NotificationsWidget'
import { ActivityTimeline } from '@/Components/Dashboard/ActivityTimeline'

interface PageProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
      email_verified_at?: string | null
      created_at: string
    }
  }
  stats: {
    total_balance: number
    safe_balance: number           // Add this
    monthly_spending: number
    total_savings: number
    active_budgets: number
    pending_transactions: number
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
  notifications: Array<{
    id: number
    type: string
    title: string
    message: string
    is_read: boolean
    link?: string | null
    read_at?: string | null
    created_at: string
  }>
  timeline: Array<{
    id: number
    action: string
    table_name: string | null
    record_id: number | null
    created_at: string
    old_values: any
    new_values: any
  }>
  insights: Array<{
    id: number
    message: string
    icon: string
    type: 'positive' | 'warning' | 'neutral'
  }>
}

const Dashboard: React.FC = () => {
  const { auth, stats, recentActivities, budgetCategories, notifications, timeline, insights } = usePage<PageProps>().props
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(Date.now())

  // Force refresh when component mounts
  useEffect(() => {
    setRefreshKey(Date.now())
  }, [])

  const handleLogout = () => {
    router.post('/logout')
  }

  // Prepare stats for StatsGrid
  const statsData = [
    {
      id: 1,
      title: 'Current Balance',
      value: `₱${(stats?.total_balance || 0).toLocaleString()}`,
      icon: 'mdi:wallet',
      trend: '+12%',
      trendUp: true,
    },
    {
      id: 2,
      title: 'Monthly Spending',
      value: `₱${(stats?.monthly_spending || 0).toLocaleString()}`,
      icon: 'mdi:chart-bar',
      trend: '-8%',
      trendUp: false,
    },
    {
      id: 3,
      title: 'Savings',
      value: `₱${(stats?.total_savings || 0).toLocaleString()}`,
      icon: 'mdi:target',
      trend: '+5%',
      trendUp: true,
    },
    {
      id: 4,
      title: 'Active Budgets',
      value: `${stats?.active_budgets || 0}`,
      icon: 'mdi:clipboard-list',
      trend: '+2',
      trendUp: true,
    },
    {
      id: 5,
      title: 'Pending Transactions',
      value: `${stats?.pending_transactions || 0}`,
      icon: 'mdi:clock-outline',
      trend: '-1',
      trendUp: true,
    },
  ]

  // Chart data
  const spendingData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
    values: [45, 25, 15, 8, 5, 2],
    colors: ['#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [60, 75, 45, 85, 70, 90, 65, 80, 55, 95, 70, 85],
  }

  const savingsData = {
    labels: ['Emergency Fund', 'Vacation Fund', 'Investment', 'Education Fund', 'New Car'],
    values: [82, 45, 30, 40, 17],
    colors: ['#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784'],
  }

  // Debug log to check data
  console.log('Dashboard stats:', stats)
  console.log('Safe balance:', stats?.safe_balance)
  console.log('Total balance:', stats?.total_balance)

  return (
    <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
      <Sidebar activePage="dashboard" onLogout={handleLogout} />

      <div className="lg:ml-[280px] min-h-screen">
        <TopNav
          title="Dashboard"
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          notificationCount={notifications?.filter((n: any) => !n.is_read).length || 0}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Welcome Card - Pass both totalBalance and safeBalance */}
            <WelcomeCard
              key={refreshKey}
              user={auth.user}
              totalBalance={stats?.total_balance || 0}
              safeBalance={stats?.safe_balance || 0}
              currency="₱"
              onTransfer={() => console.log('Transfer')}
              onViewTransactions={() => router.visit('/transactions')}
            />

            {/* Stats Grid */}
            <StatsGrid stats={statsData} />

            {/* Charts Section */}
            <ChartsSection
              spendingData={spendingData}
              monthlyData={monthlyData}
              savingsData={savingsData}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column - 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                <BudgetCategories categories={budgetCategories || []} />
                <RecentActivity activities={recentActivities || []} />
              </div>

              {/* Right Column - 1/3 */}
              <div className="space-y-6">
                <QuickActions />
                <InsightsPanel insights={insights || []} />
                <NotificationsWidget notifications={notifications || []} />
                <ActivityTimeline timeline={timeline || []} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard