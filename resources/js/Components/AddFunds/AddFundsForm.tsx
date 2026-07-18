import React from 'react'
import { Icon } from '@iconify/react'

interface AddFundsFormProps {
  formData: {
    destination: string
    amount: string
    description: string
    date: string
  }
  onInputChange: (field: string, value: any) => void
  errors: Record<string, string>
  destinations: Array<{
    id: string
    name: string
    type: string
  }>
  isSubmitting: boolean
  onSubmit: () => void
}

export const AddFundsForm: React.FC<AddFundsFormProps> = ({
  formData,
  onInputChange,
  errors,
  destinations,
  isSubmitting,
  onSubmit,
}) => {
  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters
    const numeric = value.replace(/[^0-9.]/g, '')
    // Limit to 2 decimal places
    const parts = numeric.split('.')
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('')
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2)
    }
    return numeric
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    onInputChange('amount', formatted)
  }

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-6">
      <h3 className="text-sm font-medium text-white mb-4">Deposit Details</h3>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-4">
        {/* Destination */}
        <div>
          <label className="block text-xs font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Destination
          </label>
          <div className="relative">
            <select
              value={formData.destination}
              onChange={(e) => onInputChange('destination', e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-[#1A1A1A] text-white pl-4 pr-10 h-11 sm:h-12 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.destination ? 'border-red-500 focus:ring-red-500' : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
            >
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon icon="mdi:chevron-down" className="h-5 w-5 text-[#9A9A9A]" />
            </div>
          </div>
          {errors.destination && (
            <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9A9A9A] font-medium">
              ₱
            </span>
            <input
              type="text"
              placeholder="1,000.00"
              value={formData.amount}
              onChange={handleAmountChange}
              disabled={isSubmitting}
              className={`w-full bg-[#1A1A1A] text-white pl-8 pr-4 h-11 sm:h-12 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Description <span className="text-[#9A9A9A] font-light">(Optional)</span>
          </label>
          <textarea
            placeholder="Salary, Allowance, Cash Deposit, Transfer"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            disabled={isSubmitting}
            maxLength={150}
            rows={3}
            className={`w-full bg-[#1A1A1A] text-white px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.description ? 'border-red-500 focus:ring-red-500' : 'border-[#242424] hover:border-[#3A3A3A]'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
            <p className={`text-xs ml-auto ${formData.description.length > 130 ? 'text-[#FFB74D]' : 'text-[#9A9A9A]'}`}>
              {formData.description.length}/150
            </p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Deposit Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-white px-4 h-11 sm:h-12 text-sm border border-[#242424] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#3A3A3A]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#5CB85C] text-black h-11 sm:h-12 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#6FCF70] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-offset-2 focus:ring-offset-[#111111] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding Funds...
            </span>
          ) : (
            'Add Funds'
          )}
        </button>
      </form>
    </div>
  )
}