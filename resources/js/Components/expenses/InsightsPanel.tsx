import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface InsightsPanelProps {
    insights: any[];
    loading: boolean;
}

export default function InsightsPanel({ insights, loading }: InsightsPanelProps) {
    if (loading) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 w-24 bg-[#242424] rounded" />
                    <div className="h-16 bg-[#242424] rounded" />
                    <div className="h-16 bg-[#242424] rounded" />
                </div>
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'positive':
                return TrendingUp;
            case 'warning':
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
                return '#F59E0B';
            default:
                return '#3B82F6';
        }
    };

    if (!insights?.length) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <p className="text-sm text-[#9A9A9A] text-center">
                    No insights available yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Insights</h3>
            <div className="space-y-3">
                {insights.map((insight) => {
                    const Icon = getIcon(insight.type);
                    const color = getColor(insight.type);
                    
                    return (
                        <div 
                            key={insight.id}
                            className="p-3 rounded-lg bg-[#171717] border border-[#242424]"
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