// resources/js/Components/budget/EmptyState.tsx
import { Plus } from 'lucide-react';

interface EmptyStateProps {
    onCreatePocket: () => void;
}

export default function EmptyState({ onCreatePocket }: EmptyStateProps) {
    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-white">No pockets yet</h3>
            <p className="text-[#9A9A9A] mt-1 text-sm">
                Create your first pocket to begin organizing your budget.
            </p>
            <button
                onClick={onCreatePocket}
                className="mt-4 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors inline-flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Create Pocket
            </button>
        </div>
    );
}