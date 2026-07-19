// resources/js/Components/budget/AllocationChart.tsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
    pockets: any[];
}

export default function AllocationChart({ pockets }: AllocationChartProps) {
    const activePockets = pockets.filter(p => !p.is_archived);

    if (activePockets.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <p className="text-sm text-[#9A9A9A] text-center">No allocation data</p>
            </div>
        );
    }

    const labels = activePockets.map(p => p.name);
    const data = activePockets.map(p => p.allocated);
    const colors = activePockets.map(p => p.color || '#5CB85C');

    const chartData = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#9A9A9A',
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
        },
        cutout: '70%',
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Allocation Distribution</h3>
            <div className="h-48">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}