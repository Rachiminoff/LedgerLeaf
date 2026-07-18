import React, { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amount: number
  destination: string
  isSubmitting: boolean
  destinations: Array<{
    id: string
    name: string
    type: string
  }>
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  destination,
  isSubmitting,
  destinations,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getDestinationName = (id: string) => {
    const dest = destinations.find(d => d.id === id)
    return dest?.name || 'Unknown'
  }

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-[#1A1A1A] rounded-2xl border border-[#242424] shadow-2xl max-w-md w-full animate-scaleIn"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#5CB85C]/10 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:alert" className="h-6 w-6 text-[#5CB85C]" />
            </div>
            <h3 className="text-xl font-light text-white">Confirm Deposit</h3>
            <p className="text-sm text-[#9A9A9A] font-light mt-1">
              You are about to add
            </p>
            <p className="text-2xl font-light text-[#5CB85C] mt-2">
              {formatCurrency(amount)}
            </p>
            <p className="text-sm text-[#9A9A9A] font-light mt-1">
              to <span className="text-white">{getDestinationName(destination)}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-[#9A9A9A] hover:text-white transition-colors duration-200 rounded-xl border border-[#242424] hover:border-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}