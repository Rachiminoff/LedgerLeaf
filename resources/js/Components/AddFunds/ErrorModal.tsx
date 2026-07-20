import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
  amount?: number
  destination?: string
  destinations?: Array<{ id: string; name: string; type: string }>
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  amount,
  destination,
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
    if (!destinations) return id
    const found = destinations.find(d => d.id === id)
    return found ? found.name : id
  }

  const formattedAmount = amount ? new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) : '₱0.00'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111111] border border-[#242424] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Icon icon="mdi:close-circle" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Transaction Failed</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-white transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt-style error details */}
        <div className="bg-[#171717] rounded-xl p-4 mb-6 border border-[#242424]">
          {/* Receipt Header */}
          <div className="text-center border-b border-[#242424] pb-3 mb-3">
            <p className="text-xs text-[#6B7280] font-mono tracking-wider">TRANSACTION FAILED</p>
            <p className="text-[10px] text-[#6B7280] mt-1 font-mono">
              {new Date().toLocaleString('en-PH', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Error Message */}
          <div className="text-center py-4">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
          </div>

          {/* Transaction Details */}
          {(amount || destination) && (
            <>
              <div className="border-t border-[#242424] pt-3 mt-3">
                {destination && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-xs text-[#9A9A9A]">Destination</span>
                    <span className="text-xs text-white font-mono">
                      {getDestinationName(destination)}
                    </span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-xs text-[#9A9A9A]">Amount</span>
                    <span className="text-xs text-red-500 font-mono font-medium">
                      {formattedAmount}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#5CB85C] text-black font-medium rounded-lg hover:bg-[#4a9e4a] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.visit('/dashboard')}
            className="w-full px-4 py-2.5 bg-[#171717] border border-[#242424] text-white font-medium rounded-lg hover:bg-[#1f1f1f] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}