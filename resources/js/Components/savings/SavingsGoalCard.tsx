import React from 'react';
import { Icon } from '@iconify/react';

interface SavingsGoalCardProps {
    goal: any;
    onView: () => void;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
    onDeposit: () => void;
    onWithdraw: () => void;
}

export default function SavingsGoalCard({
    goal,
    onView,
    onEdit,
    onArchive,
    onDelete,
    onDeposit,
    onWithdraw,
}: SavingsGoalCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    const isCompleted = goal.is_completed;
    const remaining = goal.target_amount - goal.current_amount;

    const formatDate = (date: string) => {
        if (!date) return 'No deadline';
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div
            className="bg-[#111111] border border-[#242424] rounded-xl p-5 hover:border-[#5CB85C] transition-all duration-300 cursor-pointer"
            onClick={onView}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white truncate">
                            {goal.name}
                        </h3>
                        {isCompleted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#5CB85C]/20 text-[#5CB85C] border border-[#5CB85C]/30">
                                Completed
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9A9A9A] mt-1">
                        <span>Target: {formatCurrency(goal.target_amount)}</span>
                        <span>•</span>
                        <span>Saved: {formatCurrency(goal.current_amount)}</span>
                        {!isCompleted && remaining > 0 && (
                            <>
                                <span>•</span>
                                <span>Remaining: {formatCurrency(remaining)}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeposit(); }}
                        className="p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Deposit"
                    >
                        <Icon icon="mdi:plus" className="w-4 h-4 text-[#5CB85C]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onWithdraw(); }}
                        className="p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Withdraw"
                    >
                        <Icon icon="mdi:minus" className="w-4 h-4 text-[#F59E0B]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Edit"
                    >
                        <Icon icon="mdi:pencil" className="w-4 h-4 text-[#9A9A9A]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onArchive(); }}
                        className="p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Archive"
                    >
                        <Icon icon="mdi:archive" className="w-4 h-4 text-[#9A9A9A]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Delete"
                    >
                        <Icon icon="mdi:delete" className="w-4 h-4 text-[#FF5A5A]" />
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <div className="flex justify-between text-xs text-[#9A9A9A] mb-1">
                    <span>{progress.toFixed(0)}%</span>
                    {goal.target_date && (
                        <span>Target: {formatDate(goal.target_date)}</span>
                    )}
                </div>
                <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: isCompleted ? '#5CB85C' : '#5CB85C',
                        }}
                    />
                </div>
            </div>

            {goal.description && (
                <p className="text-xs text-[#9A9A9A] mt-2 line-clamp-1">{goal.description}</p>
            )}

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#242424] text-xs">
                <span className="text-[#9A9A9A]">
                    Progress: <span className="text-white">{progress.toFixed(0)}%</span>
                </span>
                {!isCompleted && (
                    <span className="text-[#9A9A9A]">
                        Remaining: <span className="text-white">{formatCurrency(remaining)}</span>
                    </span>
                )}
                <span className="text-[#9A9A9A]">
                    Created: <span className="text-white">{formatDate(goal.created_at)}</span>
                </span>
            </div>
        </div>
    );
}