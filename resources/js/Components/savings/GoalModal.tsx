import React, { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Icon } from '@iconify/react'

interface GoalModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
    mode: 'create' | 'edit'
    goal: any
    loading: boolean
}

export default function GoalModal({
    isOpen,
    onClose,
    onSave,
    mode,
    goal,
    loading,
}: GoalModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        target_date: '',
        description: '',
    })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) {
            setError(null)
            return
        }

        if (mode === 'edit' && goal) {
            setFormData({
                name: goal.name || '',
                target_amount: goal.target_amount?.toString() || '',
                target_date: goal.target_date || '',
                description: goal.description || '',
            })
        } else {
            setFormData({
                name: '',
                target_amount: '',
                target_date: '',
                description: '',
            })
        }
    }, [isOpen, mode, goal])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const targetAmount = parseFloat(formData.target_amount)

        // Validate goal name
        if (!formData.name.trim()) {
            setError('Please enter a goal name')
            return
        }

        // Validate target amount
        if (!targetAmount || targetAmount <= 0) {
            setError('Please enter a valid target amount')
            return
        }

        // Validate target date
        if (formData.target_date) {
            const selectedDate = new Date(formData.target_date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            selectedDate.setHours(0, 0, 0, 0)

            if (selectedDate <= today) {
                setError('Target date must be in the future. Please select a date after today.')
                return
            }
        }

        onSave({
            name: formData.name.trim(),
            target_amount: targetAmount,
            target_date: formData.target_date || null,
            description: formData.description.trim() || null,
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Get tomorrow's date for min attribute
    const getTomorrowDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md bg-[#111111] rounded-2xl shadow-xl border border-[#242424] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-[#242424]">
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    {mode === 'create' ? 'Create Savings Goal' : 'Edit Savings Goal'}
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-[#242424] transition-colors"
                                    disabled={loading}
                                >
                                    <X className="w-5 h-5 text-[#9A9A9A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {error && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FF5A5A]/10 border border-[#FF5A5A]/30">
                                        <AlertCircle className="w-4 h-4 text-[#FF5A5A] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-[#FF5A5A]">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">
                                        Goal Name <span className="text-[#FF5A5A]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-3 py-2 bg-[#171717] border rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors ${
                                            error && !formData.name.trim() ? 'border-[#FF5A5A]' : 'border-[#242424]'
                                        }`}
                                        placeholder="e.g., New Laptop"
                                        disabled={loading}
                                        required
                                        maxLength={255}
                                    />
                                    <p className="text-xs text-[#9A9A9A] mt-1">
                                        {formData.name.length}/255 characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">
                                        Target Amount <span className="text-[#FF5A5A]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]">₱</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.target_amount}
                                            onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                            className={`w-full pl-8 pr-3 py-2 bg-[#171717] border rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors ${
                                                error && (!formData.target_amount || parseFloat(formData.target_amount) <= 0) 
                                                    ? 'border-[#FF5A5A]' 
                                                    : 'border-[#242424]'
                                            }`}
                                            placeholder="50000.00"
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                    {formData.target_amount && parseFloat(formData.target_amount) > 0 && (
                                        <p className="text-xs text-[#5CB85C] mt-1">
                                            Target: {formatCurrency(parseFloat(formData.target_amount))}
                                        </p>
                                    )}
                                    {formData.target_amount && parseFloat(formData.target_amount) <= 0 && (
                                        <p className="text-xs text-[#FF5A5A] mt-1">
                                            Please enter a positive amount
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">
                                        Target Date <span className="text-[#FF5A5A]">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.target_date}
                                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                        className={`w-full px-3 py-2 bg-[#171717] border rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors ${
                                            error && formData.target_date && new Date(formData.target_date) <= new Date()
                                                ? 'border-[#FF5A5A]'
                                                : 'border-[#242424]'
                                        }`}
                                        disabled={loading}
                                        min={getTomorrowDate()}
                                        required
                                    />
                                    <p className="text-xs text-[#9A9A9A] mt-1">
                                        Must be at least one day after today
                                    </p>
                                    {formData.target_date && new Date(formData.target_date) <= new Date() && (
                                        <p className="text-xs text-[#FF5A5A] mt-1">
                                            Please select a date after today
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-[#9A9A9A] mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#171717] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#5CB85C] transition-colors resize-none"
                                        rows={3}
                                        placeholder="Optional description of your savings goal"
                                        disabled={loading}
                                        maxLength={1000}
                                    />
                                    <p className="text-xs text-[#9A9A9A] mt-1">
                                        {formData.description.length}/1000 characters
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-[#242424]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-[#242424] text-[#9A9A9A] rounded-lg hover:border-white transition-colors disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            mode === 'create' ? 'Create Goal' : 'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}