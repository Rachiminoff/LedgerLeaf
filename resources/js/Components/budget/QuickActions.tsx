import { Plus, TrendingUp, ArrowRightLeft } from 'lucide-react';

interface QuickActionsProps {
    onCreatePocket: () => void;
    onAllocateFunds: () => void;
    onTransferFunds: () => void;
}

export default function QuickActions({ onCreatePocket, onAllocateFunds, onTransferFunds }: QuickActionsProps) {
    const actions = [
        {
            id: 'create_pocket',
            label: 'Create Pocket',
            icon: Plus,
            color: '#5CB85C',
            onClick: onCreatePocket,
            description: 'Add a new budget category',
        },
        {
            id: 'allocate_funds',
            label: 'Allocate Funds',
            icon: TrendingUp,
            color: '#3B82F6',
            onClick: onAllocateFunds,
            description: 'Move money to pockets',
        },
        {
            id: 'transfer_funds',
            label: 'Transfer Funds',
            icon: ArrowRightLeft,
            color: '#8B5CF6',
            onClick: onTransferFunds,
            description: 'Move between pockets',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}