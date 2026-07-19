import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthlyComparisonProps {
    data: Array<{
        month: string
        income: number
        expenses: number
        savings: number
    }>
}

export default function MonthlyComparison({ data }: MonthlyComparisonProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const chartData = {
        labels: data.map(d => d.month),
        datasets: [
            {
                label: 'Income',
                data: data.map(d => d.income),
                backgroundColor: 'rgba(92, 184, 92, 0.7)',
                borderColor: '#5CB85C',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Expenses',
                data: data.map(d => d.expenses),
                backgroundColor: 'rgba(255, 90, 90, 0.7)',
                borderColor: '#FF5A5A',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Savings',
                data: data.map(d => d.savings),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3B82F6',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#9A9A9A',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: {
                        size: 10,
                        family: 'Inter',
                    },
                },
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
                        return formatCurrency(context.parsed.y)
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#242424',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9A9A9A',
                    font: { size: 9, family: 'Inter' },
                    callback: function(value: any) {
                        if (value >= 1000) return (value / 1000) + 'k'
                        return value
                    }
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9A9A9A',
                    font: { size: 9, family: 'Inter' },
                },
            },
        },
    }

    if (data.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-4">Monthly Comparison</h3>
                <div className="h-48 flex items-center justify-center">
                    <p className="text-sm text-[#9A9A9A]">No monthly data available</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Monthly Comparison</h3>
            <div className="h-48">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    )
}