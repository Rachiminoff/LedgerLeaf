import React, { useState } from 'react';
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
    const [showActions, setShowActions] = useState(false);

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
    const isNearComplete = progress >= 80 && progress < 100;

    const formatDate = (date: string) => {
        if (!date) return 'No deadline';
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = () => {
        if (isCompleted) return '#5CB85C';
        if (isNearComplete) return '#F59E0B';
        return '#3B82F6';
    };

    const getStatusText = () => {
        if (isCompleted) return 'Completed';
        if (isNearComplete) return 'Near Complete';
        return 'In Progress';
    };

    const getProgressColor = () => {
        if (isCompleted) return '#5CB85C';
        if (isNearComplete) return '#F59E0B';
        return '#3B82F6';
    };

    return (
        <div
            className="group bg-[#111111] border border-[#242424] rounded-xl p-5 hover:border-[#5CB85C] hover:shadow-[0_0_30px_rgba(92,184,92,0.05)] transition-all duration-300 cursor-pointer relative"
            onClick={onView}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Header - Goal Name & Status */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-white truncate">
                            {goal.name}
                        </h3>
                        <span 
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={{
                                backgroundColor: `${getStatusColor()}20`,
                                color: getStatusColor(),
                                border: `1px solid ${getStatusColor()}30`,
                            }}
                        >
                            {getStatusText()}
                        </span>
                    </div>
                    {goal.description && (
                        <p className="text-xs text-[#9A9A9A] mt-1 line-clamp-1">
                            {goal.description}
                        </p>
                    )}
                </div>

                {/* Action Buttons - Desktop */}
                <div className={`hidden md:flex items-center gap-0.5 flex-shrink-0 ml-2 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeposit(); }}
                        className="p-2 rounded-lg hover:bg-[#5CB85C]/20 transition-colors"
                        title="Deposit"
                    >
                        <Icon icon="mdi:plus" className="w-4 h-4 text-[#5CB85C]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onWithdraw(); }}
                        className="p-2 rounded-lg hover:bg-[#F59E0B]/20 transition-colors"
                        title="Withdraw"
                    >
                        <Icon icon="mdi:minus" className="w-4 h-4 text-[#F59E0B]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-2 rounded-lg hover:bg-[#242424] transition-colors"
                        title="Edit"
                    >
                        <Icon icon="mdi:pencil" className="w-4 h-4 text-[#9A9A9A] hover:text-white" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-2 rounded-lg hover:bg-[#FF5A5A]/20 transition-colors"
                        title="Delete"
                    >
                        <Icon icon="mdi:delete" className="w-4 h-4 text-[#FF5A5A]" />
                    </button>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="flex md:hidden items-center gap-0.5 flex-shrink-0 ml-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeposit(); }}
                        className="p-2 rounded-lg hover:bg-[#5CB85C]/20 transition-colors"
                        title="Deposit"
                    >
                        <Icon icon="mdi:plus" className="w-4 h-4 text-[#5CB85C]" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onWithdraw(); }}
                        className="p-2 rounded-lg hover:bg-[#F59E0B]/20 transition-colors"
                        title="Withdraw"
                    >
                        <Icon icon="mdi:minus" className="w-4 h-4 text-[#F59E0B]" />
                    </button>
                </div>
            </div>

            {/* Progress Section */}
            <div className="mt-3">
                <div className="flex justify-between text-xs text-[#9A9A9A] mb-1.5">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{progress.toFixed(0)}%</span>
                        <span className="text-[#242424]">|</span>
                        <span>
                            {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                        </span>
                    </div>
                    {goal.target_date && (
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:calendar" className="w-3 h-3" />
                            {formatDate(goal.target_date)}
                        </span>
                    )}
                </div>
                <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: getProgressColor(),
                            backgroundImage: isCompleted ? 'none' : `linear-gradient(90deg, ${getProgressColor()}80, ${getProgressColor()})`,
                        }}
                    />
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#242424] text-xs">
                <div className="flex items-center gap-4">
                    <span className="text-[#9A9A9A]">
                        Saved: <span className="text-white font-medium">{formatCurrency(goal.current_amount)}</span>
                    </span>
                    {!isCompleted && (
                        <span className="text-[#9A9A9A]">
                            Remaining: <span className="text-[#F59E0B] font-medium">{formatCurrency(remaining)}</span>
                        </span>
                    )}
                </div>
                <span className="text-[#9A9A9A] text-[10px]">
                    Created {formatDate(goal.created_at)}
                </span>
            </div>
        </div>
    );
}