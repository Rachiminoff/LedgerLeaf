import React from 'react'
import { Icon } from '@iconify/react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PocketBreakdownProps {
    data: {
        data: Array<{
            id: number
            name: string
            icon: string
            color: string
            amount: number
            percentage: number
        }>
        total: number
    }
}

export default function PocketBreakdown({ data }: PocketBreakdownProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const chartData = {
        labels: data.data.map(d => d.name),
        datasets: [
            {
                data: data.data.map(d => d.amount),
                backgroundColor: data.data.map(d => d.color || '#5CB85C'),
                borderColor: '#111111',
                borderWidth: 2,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1A1A1A',
                titleColor: '#F8F8F8',
                bodyColor: '#9A9A9A',
                borderColor: '#242424',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`
                    }
                }
            },
        },
        cutout: '65%',
    }

    if (data.data.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Spending by Pocket</h3>
                <div className="text-center py-6">
                    <Icon icon="mdi:chart-pie" className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
                    <p className="text-sm text-[#9A9A9A]">No spending by pocket</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Spending by Pocket</h3>
            <div className="h-48">
                <Doughnut data={chartData} options={options} />
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-1.5">
                {data.data.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color || '#5CB85C' }}
                            />
                            <span className="text-[#9A9A9A] truncate">
                                {item.icon && <Icon icon={item.icon} className="inline w-3.5 h-3.5 mr-1" />}
                                {item.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[#9A9A9A]">{formatCurrency(item.amount)}</span>
                            <span className="text-white font-medium">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-3 pt-3 border-t border-[#242424] flex justify-between text-xs">
                <span className="text-[#9A9A9A]">Total</span>
                <span className="text-white font-medium">{formatCurrency(data.total)}</span>
            </div>
        </div>
    )
}