import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface SpendingTrendProps {
    data: Array<{
        date: string
        label: string
        expenses: number
        income: number
        balance: number
    }>
}

export default function SpendingTrend({ data }: SpendingTrendProps) {
    const [view, setView] = useState<'expenses' | 'income' | 'balance'>('expenses')
    const [showAll, setShowAll] = useState(false)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: 'Expenses',
                data: data.map(d => d.expenses),
                borderColor: '#FF5A5A',
                backgroundColor: 'rgba(255, 90, 90, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#FF5A5A',
            },
            {
                label: 'Income',
                data: data.map(d => d.income),
                borderColor: '#5CB85C',
                backgroundColor: 'rgba(92, 184, 92, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#5CB85C',
            },
            {
                label: 'Balance',
                data: data.map(d => d.balance),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#3B82F6',
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
                    font: { size: 10, family: 'Inter' },
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
                    font: { size: 10, family: 'Inter' },
                    maxTicksLimit: 12,
                },
            },
        },
    }

    const visibleData = showAll ? data : data.slice(-14)

    if (data.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">Spending Trend</h3>
                </div>
                <div className="h-48 flex items-center justify-center">
                    <p className="text-sm text-[#9A9A9A]">No spending data available</p>
                </div>
            </div>
        )
    }

    const currentData = {
        labels: visibleData.map(d => d.label),
        datasets: [
            {
                label: view === 'expenses' ? 'Expenses' : view === 'income' ? 'Income' : 'Balance',
                data: visibleData.map(d => view === 'expenses' ? d.expenses : view === 'income' ? d.income : d.balance),
                borderColor: view === 'expenses' ? '#FF5A5A' : view === 'income' ? '#5CB85C' : '#3B82F6',
                backgroundColor: view === 'expenses' ? 'rgba(255, 90, 90, 0.1)' : view === 'income' ? 'rgba(92, 184, 92, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: view === 'expenses' ? '#FF5A5A' : view === 'income' ? '#5CB85C' : '#3B82F6',
            },
        ],
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-medium text-white">Spending Trend</h3>
                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg overflow-hidden border border-[#242424]">
                        {['expenses', 'income', 'balance'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v as any)}
                                className={`px-3 py-1 text-xs transition-colors ${
                                    view === v
                                        ? 'bg-[#5CB85C] text-black'
                                        : 'bg-[#171717] text-[#9A9A9A] hover:text-white'
                                }`}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs text-[#9A9A9A] hover:text-white transition-colors px-2 py-1"
                    >
                        {showAll ? 'Recent' : 'All'}
                    </button>
                </div>
            </div>

            <div className="h-48">
                <Line data={currentData} options={options} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#242424]">
                <div>
                    <p className="text-[10px] text-[#9A9A9A]">Total {view === 'expenses' ? 'Spent' : view === 'income' ? 'Earned' : 'Balance'}</p>
                    <p className="text-sm font-semibold text-white">
                        {formatCurrency(visibleData.reduce((sum, d) => sum + (view === 'expenses' ? d.expenses : view === 'income' ? d.income : d.balance), 0))}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-[#9A9A9A]">Average Daily</p>
                    <p className="text-sm font-semibold text-white">
                        {formatCurrency(visibleData.reduce((sum, d) => sum + (view === 'expenses' ? d.expenses : view === 'income' ? d.income : d.balance), 0) / (visibleData.length || 1))}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-[#9A9A9A]">Highest</p>
                    <p className="text-sm font-semibold text-white">
                        {formatCurrency(Math.max(...visibleData.map(d => view === 'expenses' ? d.expenses : view === 'income' ? d.income : d.balance)))}
                    </p>
                </div>
            </div>
        </div>
    )
}