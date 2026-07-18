import React, { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  destination: string
  destinations: Array<{
    id: string
    name: string
    type: string
  }>
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
  destination,
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
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#5CB85C]/10 flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:check-circle" className="h-8 w-8 text-[#5CB85C]" />
          </div>
          
          <h3 className="text-xl font-light text-white">Funds Added Successfully</h3>
          
          <p className="text-2xl font-light text-[#5CB85C] mt-3">
            {formatCurrency(amount)}
          </p>
          <p className="text-sm text-[#9A9A9A] font-light mt-1">
            has been added to your <span className="text-white">{getDestinationName(destination)}</span>
          </p>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}