// resources/js/Components/expenses/ExpenseSummaryCards.tsx
import { 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    DollarSign,
    Clock,
    BarChart3 
} from 'lucide-react';

interface ExpenseSummaryCardsProps {
    summary: any;
    loading: boolean;
}

export default function ExpenseSummaryCards({ summary, loading }: ExpenseSummaryCardsProps) {
    const cards = [
        {
            id: 'today',
            label: "Today's Spending",
            value: summary?.today || 0,
            trend: summary?.trends?.today || 0,
            icon: Clock,
            color: '#5CB85C',
        },
        {
            id: 'week',
            label: 'This Week',
            value: summary?.this_week || 0,
            trend: summary?.trends?.this_week || 0,
            icon: Calendar,
            color: '#3B82F6',
        },
        {
            id: 'month',
            label: 'This Month',
            value: summary?.this_month || 0,
            trend: summary?.trends?.this_month || 0,
            icon: BarChart3,
            color: '#8B5CF6',
        },
        {
            id: 'average',
            label: 'Average Daily',
            value: summary?.average_daily || 0,
            icon: DollarSign,
            color: '#F59E0B',
        },
        {
            id: 'largest',
            label: 'Largest Expense',
            value: summary?.largest_expense || 0,
            icon: TrendingUp,
            color: '#EF4444',
        },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4 animate-pulse">
                        <div className="h-4 w-20 bg-[#242424] rounded mb-2" />
                        <div className="h-6 w-24 bg-[#242424] rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {cards.map((card) => {
                const Icon = card.icon;
                const isPositive = card.trend > 0;
                
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
                                    {formatCurrency(card.value)}
                                </p>
                                {card.trend !== 0 && (
                                    <div className="flex items-center gap-1 mt-1.5">
                                        {isPositive ? (
                                            <TrendingUp className="w-3.5 h-3.5 text-[#5CB85C]" />
                                        ) : (
                                            <TrendingDown className="w-3.5 h-3.5 text-[#FF5A5A]" />
                                        )}
                                        <span className={`text-xs font-medium ${
                                            isPositive ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'
                                        }`}>
                                            {Math.abs(card.trend)}%
                                        </span>
                                        <span className="text-xs text-[#9A9A9A]">vs last period</span>
                                    </div>
                                )}
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