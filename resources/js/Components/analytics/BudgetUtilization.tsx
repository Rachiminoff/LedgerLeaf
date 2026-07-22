import React from 'react';
import { Icon } from '@iconify/react';

interface BudgetUtilizationProps {
    totalAllocated: number;
    totalSpent: number;
    pockets: Array<{
        id: number;
        name: string;
        allocated: number;
        spent: number;
        color: string;
    }>;
}

export default function BudgetUtilization({ totalAllocated, totalSpent, pockets }: BudgetUtilizationProps) {
    const utilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    const isExceeded = utilization > 100;
    const remaining = totalAllocated - totalSpent;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Get top 5 pockets by spending
    const topPockets = [...pockets]
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Budget Utilization</h3>
                <span className={`text-sm font-medium ${isExceeded ? 'text-[#FF5A5A]' : 'text-[#5CB85C]'}`}>
                    {isExceeded ? 'Exceeded' : `${utilization.toFixed(0)}%`}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs text-[#9A9A9A] mb-1">
                    <span>Used</span>
                    <span>
                        {formatCurrency(totalSpent)} / {formatCurrency(totalAllocated)}
                    </span>
                </div>
                <div className="w-full h-2.5 bg-[#242424] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.min(utilization, 100)}%`,
                            backgroundColor: isExceeded ? '#FF5A5A' : '#5CB85C',
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-[#9A9A9A] mt-1">
                    <span>Remaining: {formatCurrency(Math.max(remaining, 0))}</span>
                    {isExceeded && (
                        <span className="text-[#FF5A5A]">Over by {formatCurrency(Math.abs(remaining))}</span>
                    )}
                </div>
            </div>

            {topPockets.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-[#9A9A9A] font-medium">Top Spending</p>
                    {topPockets.map((pocket) => {
                        const pocketUtil = pocket.allocated > 0 ? (pocket.spent / pocket.allocated) * 100 : 0;
                        const isOver = pocketUtil > 100;
                        return (
                            <div key={pocket.id} className="flex items-center gap-3">
                                <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: pocket.color || '#5CB85C' }}
                                />
                                <span className="text-xs text-[#9A9A9A] flex-1 truncate">
                                    {pocket.name}
                                </span>
                                <span className={`text-xs font-medium ${isOver ? 'text-[#FF5A5A]' : 'text-white'}`}>
                                    {isOver ? 'Over' : `${pocketUtil.toFixed(0)}%`}
                                </span>
                                <div className="w-16 h-1.5 bg-[#242424] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(pocketUtil, 100)}%`,
                                            backgroundColor: isOver ? '#FF5A5A' : pocket.color || '#5CB85C',
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}