import React from 'react';
import { Icon } from '@iconify/react';

interface EmptyStateProps {
    onCreateGoal: () => void;
}

export default function EmptyState({ onCreateGoal }: EmptyStateProps) {
    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
            <div className="text-4xl mb-4 text-[#9A9A9A]">
                <Icon icon="mdi:target" className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white">No savings goals yet</h3>
            <p className="text-sm text-[#9A9A9A] mt-1">
                Create your first savings goal and start building your future.
            </p>
            <button
                onClick={onCreateGoal}
                className="mt-4 px-6 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors"
            >
                Create Your First Goal
            </button>
        </div>
    );
}