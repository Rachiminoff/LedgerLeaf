import { Wallet, PiggyBank, Briefcase, Target } from 'lucide-react';
import { Icon } from '@iconify/react';

interface BudgetSummaryCardsProps {
    summary: any;
    loading: boolean;
}

export default function BudgetSummaryCards({ summary, loading }: BudgetSummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const cards = [
        {
            id: 'safe_balance',
            label: 'Safe Balance',
            value: summary?.safe_balance || 0,
            icon: Wallet,
            iconify: 'mdi:wallet',
            color: '#5CB85C',
        },
        {
            id: 'allocated',
            label: 'Allocated',
            value: summary?.allocated_balance || 0,
            icon: Briefcase,
            iconify: 'mdi:briefcase',
            color: '#3B82F6',
        },
        {
            id: 'remaining',
            label: 'Remaining',
            value: summary?.remaining_balance || 0,
            icon: PiggyBank,
            iconify: 'mdi:bank',
            color: '#8B5CF6',
        },
        {
            id: 'pockets',
            label: 'Total Pockets',
            value: summary?.total_pockets || 0,
            icon: Target,
            iconify: 'mdi:target',
            color: '#F59E0B',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4 animate-pulse">
                        <div className="h-4 w-20 bg-[#242424] rounded mb-2" />
                        <div className="h-6 w-24 bg-[#242424] rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.id}
                        className="group relative bg-[#111111] border border-[#242424] rounded-xl p-4 hover:border-[#5CB85C] transition-all duration-300 hover:shadow-[0_0_30px_rgba(92,184,92,0.05)]"
                    >
                        <div 
                            className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ backgroundColor: card.color }}
                        />
                        
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-[#9A9A9A] font-medium uppercase tracking-wider">
                                    {card.label}
                                </p>
                                <p className="text-xl font-bold text-white mt-1.5 font-mono">
                                    {typeof card.value === 'number' && card.id !== 'pockets' 
                                        ? formatCurrency(card.value) 
                                        : card.value}
                                </p>
                            </div>
                            <div 
                                className="p-2 rounded-lg bg-[#171717] group-hover:scale-110 transition-transform duration-200"
                                style={{ color: card.color }}
                            >
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}