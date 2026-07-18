// resources/js/Components/expenses/ExpenseStats.tsx
import { PieChart, BarChart } from '@/Components/ui/charts';
import { Skeleton } from '@/Components/ui/skeleton';

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

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Spending Breakdown</h3>
            
            {/* Top Categories */}
            {stats?.topCategories && (
                <div className="space-y-3">
                    {stats.topCategories.map((category: any, index: number) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9A9A9A]">{category.name}</span>
                                <span className="text-white font-medium">
                                    {category.percentage}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#242424] rounded-full mt-1">
                                <div
                                    className="h-1.5 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${category.percentage}%`,
                                        backgroundColor: category.color || '#5CB85C',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!stats?.topCategories?.length && (
                <p className="text-sm text-[#9A9A9A] text-center py-8">
                    No spending data available
                </p>
            )}
        </div>
    );
}