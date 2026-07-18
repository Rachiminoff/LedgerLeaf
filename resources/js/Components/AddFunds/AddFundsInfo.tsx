import React from 'react'
import { Icon } from '@iconify/react'

export const AddFundsInfo: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-[#5CB85C]/20 p-4 mb-6 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#5CB85C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon icon="mdi:information" className="h-4 w-4 text-[#5CB85C]" />
      </div>
      <div>
        <p className="text-sm text-[#9A9A9A] font-light leading-relaxed">
          Adding funds increases your available balance. Funds added here are deposited into your
          <span className="text-white font-medium"> Safe Balance</span> before being allocated to your pockets.
        </p>
      </div>
    </div>
  )
}