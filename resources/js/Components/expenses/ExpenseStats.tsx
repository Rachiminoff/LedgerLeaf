// resources/js/Components/expenses/ExpenseStats.tsx
import { PieChart, BarChart } from '@/Components/ui/charts';
import { Skeleton } from '@/Components/ui/skeleton';
import { Icon } from '@iconify/react';

interface ExpenseStatsProps {
    stats: any;
    loading: boolean;
}

export default function ExpenseStats({ stats, loading }: ExpenseStatsProps) {
    if (loading) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <Skeleton className="h-6 w-32 bg-[#242424] mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-40 w-full bg-[#242424]" />
                    <Skeleton className="h-6 w-24 bg-[#242424]" />
                </div>
            </div>
        );
    }

    // Calculate total for percentages if not provided
    const totalSpent = stats?.total_spent || stats?.topCategories?.reduce((sum: number, cat: any) => sum + cat.total, 0) || 0;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Spending Breakdown</h3>
            
            {/* Total Spent */}
            {totalSpent > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-[#171717] border border-[#242424]">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#9A9A9A]">Total Spent</span>
                        <span className="text-lg font-bold text-white">{formatCurrency(totalSpent)}</span>
                    </div>
                </div>
            )}

            {/* Top Categories */}
            {stats?.topCategories && stats.topCategories.length > 0 ? (
                <div className="space-y-3">
                    {stats.topCategories.map((category: any, index: number) => {
                        const percentage = category.percentage || (totalSpent > 0 ? (category.total / totalSpent) * 100 : 0);
                        const color = category.color || '#5CB85C';
                        
                        return (
                            <div key={index} className="group">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {category.icon && (
                                            <Icon 
                                                icon={category.icon} 
                                                className="w-4 h-4 flex-shrink-0" 
                                                style={{ color: color }}
                                            />
                                        )}
                                        <span className="text-sm text-[#9A9A9A] truncate">
                                            {category.name || 'Uncategorized'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-xs text-[#9A9A9A]">
                                            {formatCurrency(category.total || 0)}
                                        </span>
                                        <span className="text-sm font-medium text-white min-w-[40px] text-right">
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-[#242424] rounded-full mt-1 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                                        style={{
                                            width: `${Math.min(percentage, 100)}%`,
                                            backgroundColor: color,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-4xl mb-3 text-[#9A9A9A]">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-[#9A9A9A]">
                        No spending data available
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                        Start adding expenses to see your spending breakdown
                    </p>
                </div>
            )}

            {/* Pocket Distribution (if available) */}
            {stats?.pocketDistribution && stats.pocketDistribution.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#242424]">
                    <h4 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
                        By Pocket
                    </h4>
                    <div className="space-y-2">
                        {stats.pocketDistribution.slice(0, 5).map((pocket: any, index: number) => {
                            const percentage = pocket.percentage || (totalSpent > 0 ? (pocket.amount / totalSpent) * 100 : 0);
                            const color = pocket.color || '#8B5CF6';
                            
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {pocket.icon && (
                                            <Icon 
                                                icon={pocket.icon} 
                                                className="w-3.5 h-3.5" 
                                                style={{ color: color }}
                                            />
                                        )}
                                        <span className="text-xs text-[#9A9A9A]">{pocket.name}</span>
                                    </div>
                                    <span className="text-xs text-[#9A9A9A]">
                                        {formatCurrency(pocket.amount || 0)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Monthly Trend (if available) */}
            {stats?.monthlyTrend && stats.monthlyTrend.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#242424]">
                    <h4 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
                        Monthly Trend
                    </h4>
                    <div className="flex items-end gap-1 h-16">
                        {stats.monthlyTrend.map((month: any, index: number) => {
                            const max = Math.max(...stats.monthlyTrend.map((m: any) => m.amount || 0));
                            const height = max > 0 ? (month.amount / max) * 100 : 0;
                            const isHighest = month.amount === max && max > 0;
                            
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div 
                                        className={`w-full rounded-sm transition-all duration-500 ${
                                            isHighest ? 'bg-[#5CB85C]' : 'bg-[#242424]'
                                        }`}
                                        style={{ 
                                            height: `${Math.max(height, 2)}%`,
                                            minHeight: '2px'
                                        }}
                                    />
                                    <span className="text-[8px] text-[#6B7280]">
                                        {month.month?.substring(0, 3) || 'N/A'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}