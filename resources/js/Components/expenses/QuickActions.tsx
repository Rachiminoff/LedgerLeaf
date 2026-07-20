import { Plus, Archive } from 'lucide-react';

interface QuickActionsProps {
    onCreateExpense: () => void;
    onViewArchived: () => void;
}

export default function QuickActions({ onCreateExpense, onViewArchived }: QuickActionsProps) {
    const actions = [
        {
            id: 'add',
            label: 'Add Expense',
            icon: Plus,
            color: '#5CB85C',
            onClick: onCreateExpense,
        },
        {
            id: 'archived',
            label: 'Archived Expenses',
            icon: Archive,
            color: '#F59E0B',
            onClick: onViewArchived,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="group relative bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-300 hover:shadow-[0_0_30px_rgba(92,184,92,0.05)] text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className="p-2.5 rounded-lg bg-[#171717] group-hover:scale-110 transition-transform duration-200"
                                style={{ color: action.color }}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {action.label}
                                </p>
                                <p className="text-xs text-[#9A9A9A]">
                                    Click to {action.label.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}