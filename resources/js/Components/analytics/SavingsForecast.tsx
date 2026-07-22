import React from 'react';
import { Icon } from '@iconify/react';

interface SavingsForecastProps {
    totalSaved: number;
    totalTarget: number;
    monthlySavingsRate: number;
    goals: Array<{
        id: number;
        name: string;
        target_amount: number;
        current_amount: number;
        created_at: string;
    }>;
}

export default function SavingsForecast({
    totalSaved,
    totalTarget,
    monthlySavingsRate,
    goals,
}: SavingsForecastProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const remaining = totalTarget - totalSaved;

    // Calculate estimated completion date
    const getEstimatedCompletion = () => {
        if (monthlySavingsRate <= 0 || remaining <= 0) return null;
        const monthsToComplete = remaining / monthlySavingsRate;
        const date = new Date();
        date.setMonth(date.getMonth() + Math.ceil(monthsToComplete));
        return date;
    };

    const estimatedDate = getEstimatedCompletion();

    // Calculate suggested monthly deposit (10% of remaining over 12 months)
    const suggestedMonthly = remaining > 0 ? Math.ceil(remaining / 12) : 0;

    // Get active goals
    const activeGoals = goals.filter(g => !g.is_completed);

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
            <h3 className="text-sm font-medium text-white mb-4">Savings Forecast</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs text-[#9A9A9A]">Total Saved</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(totalSaved)}</p>
                    <span className="text-xs text-[#5CB85C]">{progress.toFixed(0)}% of target</span>
                </div>
                <div className="bg-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs text-[#9A9A9A]">Monthly Rate</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(monthlySavingsRate)}</p>
                    <span className="text-xs text-[#9A9A9A]">Average per month</span>
                </div>
            </div>

            {estimatedDate && (
                <div className="bg-[#1A1A1A] rounded-lg p-3 mb-4 border border-[#5CB85C]/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#9A9A9A]">Estimated Completion</p>
                            <p className="text-sm font-semibold text-white">
                                {estimatedDate.toLocaleDateString('en-PH', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#9A9A9A]">Suggested Monthly</p>
                            <p className="text-sm font-semibold text-[#5CB85C]">
                                {formatCurrency(suggestedMonthly)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#5CB85C] to-[#70C970]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {activeGoals.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-[#9A9A9A] font-medium">Active Goals</p>
                    {activeGoals.slice(0, 3).map((goal) => {
                        const goalProgress = goal.target_amount > 0
                            ? (goal.current_amount / goal.target_amount) * 100
                            : 0;
                        return (
                            <div key={goal.id} className="flex items-center justify-between text-xs">
                                <span className="text-[#9A9A9A] truncate flex-1">{goal.name}</span>
                                <span className="text-white font-medium ml-2">
                                    {goalProgress.toFixed(0)}%
                                </span>
                            </div>
                        );
                    })}
                    {activeGoals.length > 3 && (
                        <p className="text-[10px] text-[#9A9A9A] text-center">
                            +{activeGoals.length - 3} more goals
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}