import React, { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ChartsSectionProps {
  spendingData?: {
    labels: string[]
    values: number[]
    colors: string[]
  }
  monthlyData?: {
    labels: string[]
    values: number[]
  }
  savingsData?: {
    labels: string[]
    values: number[]
    colors: string[]
  }
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  spendingData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
    values: [45, 25, 15, 8, 5, 2],
    colors: ['#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
  },
  monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [60, 75, 45, 85, 70, 90, 65, 80, 55, 95, 70, 85],
  },
  savingsData = {
    labels: ['Emergency Fund', 'Vacation Fund', 'Investment', 'Education Fund', 'New Car'],
    values: [82, 45, 30, 40, 17],
    colors: ['#5CB85C', '#70C970', '#4CAF50', '#66BB6A', '#81C784'],
  },
}) => {
  const pieChartRef = useRef<any>(null)

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9A9A9A',
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
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
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${percentage}%`
          }
        }
      },
    },
    cutout: '60%',
  }

  // Bar chart options
  const barOptions = {
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#242424',
          drawBorder: false,
        },
        ticks: {
          color: '#9A9A9A',
          font: {
            size: 8,
            family: 'Inter',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9A9A9A',
          font: {
            size: 8,
            family: 'Inter',
          },
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Spending Distribution - Pie Chart */}
      <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Spending Distribution</h3>
          <Icon icon="mdi:chart-pie" className="h-4 w-4 text-[#9A9A9A]" />
        </div>
        <div className="h-48">
          <Pie
            ref={pieChartRef}
            data={{
              labels: spendingData.labels,
              datasets: [
                {
                  data: spendingData.values,
                  backgroundColor: spendingData.colors,
                  borderColor: '#111111',
                  borderWidth: 2,
                },
              ],
            }}
            options={pieOptions}
          />
        </div>
      </div>

      {/* Monthly Activity - Bar Chart */}
      <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Monthly Activity</h3>
          <Icon icon="mdi:chart-bar" className="h-4 w-4 text-[#9A9A9A]" />
        </div>
        <div className="h-48">
          <Bar
            data={{
              labels: monthlyData.labels,
              datasets: [
                {
                  label: 'Spending',
                  data: monthlyData.values,
                  backgroundColor: monthlyData.values.map((_, i) =>
                    i === monthlyData.values.length - 1 ? '#5CB85C' : '#242424'
                  ),
                  borderColor: monthlyData.values.map((_, i) =>
                    i === monthlyData.values.length - 1 ? '#5CB85C' : '#242424'
                  ),
                  borderWidth: 1,
                  borderRadius: 4,
                },
              ],
            }}
            options={barOptions}
          />
        </div>
      </div>

      {/* Savings Progress */}
      <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Savings Progress</h3>
          <Icon icon="mdi:target" className="h-4 w-4 text-[#9A9A9A]" />
        </div>
        <div className="space-y-4">
          {savingsData.labels.map((label, index) => (
            <div key={label}>
              <div className="flex justify-between text-xs">
                <span className="text-[#9A9A9A]">{label}</span>
                <span className="text-white">{savingsData.values[index]}%</span>
              </div>
              <div className="w-full h-2 bg-[#1A1A1A] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${savingsData.values[index]}%`,
                    backgroundColor: savingsData.colors[index] || '#5CB85C',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}