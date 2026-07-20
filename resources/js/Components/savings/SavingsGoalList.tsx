import React from 'react';
import SavingsGoalCard from './SavingsGoalCard';

interface SavingsGoalListProps {
    goals: any[];
    onViewGoal: (goal: any) => void;
    onEditGoal: (goal: any) => void;
    onArchiveGoal: (id: number) => void;
    onDeleteGoal: (id: number) => void;
    onDeposit: (goal: any) => void;
    onWithdraw: (goal: any) => void;
    isMobile?: boolean;
}

export default function SavingsGoalList({
    goals,
    onViewGoal,
    onEditGoal,
    onArchiveGoal,
    onDeleteGoal,
    onDeposit,
    onWithdraw,
}: SavingsGoalListProps) {
    if (goals.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {goals.map((goal) => (
                <SavingsGoalCard
                    key={goal.id}
                    goal={goal}
                    onView={() => onViewGoal(goal)}
                    onEdit={() => onEditGoal(goal)}
                    onArchive={() => onArchiveGoal(goal.id)}
                    onDelete={() => onDeleteGoal(goal.id)}
                    onDeposit={() => onDeposit(goal)}
                    onWithdraw={() => onWithdraw(goal)}
                />
            ))}
        </div>
    );
}