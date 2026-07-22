// resources/js/Components/budget/AllocationChart.tsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
    pockets: any[];
}

export default function AllocationChart({ pockets }: AllocationChartProps) {
    const activePockets = pockets.filter(p => !p.is_archived && p.allocated > 0);

    if (activePockets.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-[#9A9A9A] text-center">No allocation data</p>
                    <p className="text-xs text-[#6B7280] text-center mt-1">Create pockets and allocate funds to see distribution</p>
                </div>
            </div>
        );
    }

    // Sort pockets by allocation (descending)
    const sortedPockets = [...activePockets].sort((a, b) => (b.allocated || 0) - (a.allocated || 0));

    // Ensure all values are numbers
    const labels = sortedPockets.map(p => p.name || 'Unnamed');
    const data = sortedPockets.map(p => parseFloat(p.allocated) || 0);
    const colors = sortedPockets.map(p => p.color || '#5CB85C');
    
    // Calculate total - ensure it's a number
    const total = data.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#111111',
                hoverOffset: 15,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1A1A1A',
                titleColor: '#FFFFFF',
                bodyColor: '#9A9A9A',
                borderColor: '#242424',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ₱${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '72%',
        animation: {
            animateRotate: true,
            animateScale: true,
        },
    };

    // Format amount (remove decimals, add commas)
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Safe number formatting with fallback
    const safeFormat = (value: any) => {
        const num = parseFloat(value) || 0;
        return formatAmount(num);
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
            <h3 className="text-sm font-medium text-white mb-4 text-center">Allocation Distribution</h3>

            {/* Chart and Legend Side by Side - Centered */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Chart - Centered */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0">
                    <Doughnut data={chartData} options={options} />
                </div>

                {/* Custom Legend - Scrollable if many pockets */}
                <div className="flex-1 w-full max-w-xs min-w-0">
                    <div className="max-h-40 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                        {sortedPockets.map((pocket) => {
                            const percentage = total > 0 ? ((pocket.allocated / total) * 100) : 0;
                            return (
                                <div key={pocket.id} className="flex items-center gap-2 py-1.5 border-b border-[#242424]/50 last:border-0">
                                    <div 
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: pocket.color || '#5CB85C' }}
                                    />
                                    <span className="text-xs text-[#9A9A9A] flex-1 truncate min-w-0">
                                        {pocket.name}
                                    </span>
                                    <span className="text-[10px] text-[#5CB85C] flex-shrink-0">
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-[#242424] grid grid-cols-2 gap-2">
                <div className="text-center">
                    <p className="text-xs text-[#9A9A9A]">Pockets</p>
                    <p className="text-sm font-semibold text-white">{sortedPockets.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-[#9A9A9A]">Average</p>
                    <p className="text-sm font-semibold text-white">
                        {safeFormat(total / sortedPockets.length)}
                    </p>
                </div>
            </div>
        </div>
    );
}