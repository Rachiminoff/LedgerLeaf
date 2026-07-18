import React from 'react'
import { Icon } from '@iconify/react'

interface AddFundsSummaryProps {
  destination: string
  amount: number
  currentSafeBalance: number
  newSafeBalance: number
  destinations: Array<{
    id: string
    name: string
    type: string
  }>
}

export const AddFundsSummary: React.FC<AddFundsSummaryProps> = ({
  destination,
  amount,
  currentSafeBalance,
  newSafeBalance,
  destinations,
}) => {
  const getDestinationName = (id: string) => {
    const dest = destinations.find(d => d.id === id)
    return dest?.name || 'Unknown'
  }

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-6 sticky top-24">
      <h3 className="text-sm font-medium text-white mb-4">Deposit Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#9A9A9A]">Destination</span>
          <span className="text-white font-medium">{getDestinationName(destination)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#9A9A9A]">Amount</span>
          <span className="text-white font-medium">{formatCurrency(amount)}</span>
        </div>

        <div className="border-t border-[#242424] pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#9A9A9A]">Current Safe Balance</span>
            <span className="text-white">{formatCurrency(currentSafeBalance)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-[#5CB85C]">New Safe Balance</span>
            <span className="text-[#5CB85C] font-medium">{formatCurrency(newSafeBalance)}</span>
          </div>
        </div>

        {amount > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#5CB85C]/20">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:check-circle" className="h-4 w-4 text-[#5CB85C]" />
              <p className="text-xs text-[#5CB85C] font-light">
                Ready to deposit {formatCurrency(amount)} to {getDestinationName(destination)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}