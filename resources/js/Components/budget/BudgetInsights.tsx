// resources/js/Components/budget/BudgetInsights.tsx
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface BudgetInsightsProps {
    insights: any[];
}

export default function BudgetInsights({ insights }: BudgetInsightsProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'positive':
                return CheckCircle;
            case 'warning':
                return AlertCircle;
            case 'critical':
                return AlertCircle;
            default:
                return Lightbulb;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'positive':
                return '#5CB85C';
            case 'warning':
                return '#F4B400';
            case 'critical':
                return '#FF5A5A';
            default:
                return '#3B82F6';
        }
    };

    if (!insights || insights.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <p className="text-sm text-[#9A9A9A] text-center">No insights available</p>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Budget Insights</h3>
            <div className="space-y-3">
                {insights.map((insight) => {
                    const Icon = getIcon(insight.type);
                    const color = getColor(insight.type);
                    return (
                        <div
                            key={insight.id}
                            className="p-3 rounded-lg bg-[#1A1A1A] border border-[#242424]"
                        >
                            <div className="flex items-start gap-3">
                                <div style={{ color }}>
                                    <Icon className="w-4 h-4 mt-0.5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {insight.title}
                                    </p>
                                    <p className="text-xs text-[#9A9A9A] mt-0.5">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}