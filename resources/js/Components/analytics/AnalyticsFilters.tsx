import React, { useState } from 'react'
import { Icon } from '@iconify/react'

interface AnalyticsFiltersProps {
    period: string
    onPeriodChange: (period: string) => void
    startDate: string
    endDate: string
    onCustomDateChange: (start: string, end: string) => void
    loading: boolean
}

export default function AnalyticsFilters({
    period,
    onPeriodChange,
    startDate,
    endDate,
    onCustomDateChange,
    loading,
}: AnalyticsFiltersProps) {
    const [showCustom, setShowCustom] = useState(false)

    const periods = [
        { value: 'this_week', label: 'This Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_3_months', label: 'Last 3 Months' },
        { value: 'this_year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' },
    ]

    const handlePeriodSelect = (value: string) => {
        onPeriodChange(value)
        setShowCustom(value === 'custom')
    }

    const handleApplyCustom = () => {
        if (startDate && endDate) {
            onCustomDateChange(startDate, endDate)
        }
    }

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[#9A9A9A]">Period:</span>
                {periods.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => handlePeriodSelect(p.value)}
                        disabled={loading}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            period === p.value && !showCustom
                                ? 'bg-[#5CB85C] text-black'
                                : 'bg-[#171717] text-[#9A9A9A] hover:text-white border border-[#242424] hover:border-[#5CB85C]'
                        } disabled:opacity-50`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {showCustom && (
                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#242424]">
                    <div>
                        <label className="text-xs text-[#9A9A9A] block mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onCustomDateChange(e.target.value, endDate)}
                            className="px-3 py-1.5 bg-[#171717] border border-[#242424] rounded-lg text-white text-sm focus:outline-none focus:border-[#5CB85C]"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[#9A9A9A] block mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => onCustomDateChange(startDate, e.target.value)}
                            className="px-3 py-1.5 bg-[#171717] border border-[#242424] rounded-lg text-white text-sm focus:outline-none focus:border-[#5CB85C]"
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleApplyCustom}
                        disabled={loading || !startDate || !endDate}
                        className="px-4 py-1.5 bg-[#5CB85C] text-black rounded-lg text-sm hover:bg-[#6FCF70] transition-colors disabled:opacity-50 mt-1"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    )
}