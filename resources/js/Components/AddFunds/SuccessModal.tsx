import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  destination: string
  description: string
  date: string
  destinations: Array<{ id: string; name: string; type: string }>
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
  destination,
  description,
  date,
  destinations,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getDestinationName = (id: string) => {
    const found = destinations.find(d => d.id === id)
    return found ? found.name : id
  }

  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  const transactionId = 'LL-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111111] border border-[#242424] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
              <Icon icon="mdi:check-circle" className="w-6 h-6 text-[#5CB85C]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Transaction Successful</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-white transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt-style success */}
        <div className="bg-[#171717] rounded-xl p-4 mb-6 border border-[#242424]">
          {/* Receipt Header */}
          <div className="text-center border-b border-[#242424] pb-3 mb-3">
            <div className="flex justify-center mb-1">
              <Icon icon="mdi:check-circle" className="w-8 h-8 text-[#5CB85C]" />
            </div>
            <p className="text-xs text-[#6B7280] font-mono tracking-wider">PAYMENT RECEIPT</p>
            <p className="text-[10px] text-[#6B7280] mt-1 font-mono">
              {new Date(date).toLocaleString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Receipt Body */}
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-[#242424]/50">
              <span className="text-xs text-[#9A9A9A]">Transaction ID</span>
              <span className="text-xs text-white font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#242424]/50">
              <span className="text-xs text-[#9A9A9A]">Destination</span>
              <span className="text-xs text-white font-mono">
                {getDestinationName(destination)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#242424]/50">
              <span className="text-xs text-[#9A9A9A]">Amount</span>
              <span className="text-xs text-[#5CB85C] font-mono font-medium">
                +{formattedAmount}
              </span>
            </div>
            {description && (
              <div className="flex justify-between py-1.5 border-b border-[#242424]/50">
                <span className="text-xs text-[#9A9A9A]">Description</span>
                <span className="text-xs text-white font-mono max-w-[150px] truncate">
                  {description}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-xs text-[#9A9A9A]">Status</span>
              <span className="text-xs text-[#5CB85C] font-mono">COMPLETED</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="border-t border-[#242424] pt-3 mt-3 text-center">
            <p className="text-[10px] text-[#6B7280] font-mono">
              Thank you for using LedgerLeaf
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#171717] border border-[#242424] text-white font-medium rounded-lg hover:bg-[#1f1f1f] transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#5CB85C] text-black font-medium rounded-lg hover:bg-[#4a9e4a] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}