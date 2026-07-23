import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface BudgetHealthWidgetProps {
    health: number;
}

export default function BudgetHealthWidget({ health }: BudgetHealthWidgetProps) {
    const getHealthLabel = (value: number) => {
        if (value >= 90) return { label: 'Excellent', color: '#5CB85C', icon: CheckCircle };
        if (value >= 70) return { label: 'Good', color: '#3B82F6', icon: CheckCircle };
        if (value >= 50) return { label: 'Fair', color: '#F4B400', icon: AlertCircle };
        if (value >= 30) return { label: 'Needs Attention', color: '#F59E0B', icon: AlertCircle };
        return { label: 'Critical', color: '#FF5A5A', icon: AlertCircle };
    };

    // Round the health value
    const roundedHealth = Math.round(health);
    const healthInfo = getHealthLabel(roundedHealth);
    const clampedHealth = Math.min(Math.max(roundedHealth, 0), 100);

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Budget Health</h3>
                <Shield className="w-5 h-5 text-[#5CB85C]" />
            </div>

            <div className="relative">
                <div className="text-center">
                    <p className="text-4xl font-bold text-white font-mono">{clampedHealth}%</p>
                    <p 
                        className="text-sm font-medium mt-1"
                        style={{ color: healthInfo.color }}
                    >
                        {healthInfo.label}
                    </p>
                </div>

                <div className="mt-4">
                    <div className="w-full h-2 bg-[#242424] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${clampedHealth}%`,
                                backgroundColor: healthInfo.color,
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-between text-xs text-[#9A9A9A] mt-2">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}