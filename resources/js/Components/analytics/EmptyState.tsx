import React from 'react'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'

export default function EmptyState() {
    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-12 text-center">
            <div className="text-4xl mb-4 text-[#9A9A9A]">
                <Icon icon="mdi:chart-line" className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white">Not enough financial data yet</h3>
            <p className="text-sm text-[#9A9A9A] mt-1">
                Continue using LedgerLeaf to unlock personalized insights.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button
                    onClick={() => router.visit('/expenses')}
                    className="px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors"
                >
                    Add Expense
                </button>
                <button
                    onClick={() => router.visit('/budget')}
                    className="px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors"
                >
                    Budget Planner
                </button>
            </div>
        </div>
    )
}