import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Sidebar } from '@/Components/Dashboard/Sidebar'
import { TopNav } from '@/Components/Dashboard/TopNav'
import { AddFundsForm } from '@/Components/AddFunds/AddFundsForm'
import { AddFundsSummary } from '@/Components/AddFunds/AddFundsSummary'
import { AddFundsInfo } from '@/Components/AddFunds/AddFundsInfo'
import { ConfirmModal } from '@/Components/AddFunds/ConfirmModal'
import { SuccessModal } from '@/Components/AddFunds/SuccessModal'
import { ErrorModal } from '@/Components/AddFunds/ErrorModal'

interface PageProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
    }
  }
  balances: {
    safe_balance: number
    pocket_balance: number
    total_balance: number
  }
  destinations: Array<{
    id: string
    name: string
    type: string
  }>
  recentDeposits?: Array<{
    id: number
    amount: number
    description: string
    created_at: string
  }>
}

const AddFunds: React.FC = () => {
  const { auth, balances, destinations, recentDeposits = [] } = usePage<PageProps>().props
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    destination: 'safe_balance',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittedAmount, setSubmittedAmount] = useState(0)
  const [submittedDestination, setSubmittedDestination] = useState('')
  const [submittedDescription, setSubmittedDescription] = useState('')
  const [submittedDate, setSubmittedDate] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const amount = parseFloat(formData.amount)

    if (!formData.destination) {
      newErrors.destination = 'Please select a destination'
    }

    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero'
    }

    if (amount > 1000000) {
      newErrors.amount = 'Maximum deposit amount is ₱1,000,000'
    }

    if (formData.description && formData.description.length > 150) {
      newErrors.description = 'Description cannot exceed 150 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    setSubmittedAmount(parseFloat(formData.amount))
    setSubmittedDestination(formData.destination)
    setSubmittedDescription(formData.description || '')
    setSubmittedDate(formData.date)
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    setIsSubmitting(true)
    setShowConfirmModal(false)

    const amount = parseFloat(formData.amount)

    router.post('/add-funds', {
      destination: formData.destination,
      amount: amount,
      description: formData.description || null,
      date: formData.date,
    }, {
      onSuccess: () => {
        setIsSubmitting(false)
        setShowSuccessModal(true)
        // Reload the page to get fresh data
        setTimeout(() => {
          router.reload({ preserveState: false })
        }, 300)
      },
      onError: (errors) => {
        setIsSubmitting(false)
        // Check if there's a specific error message
        const errorMsg = errors.message || errors.error || 'Something went wrong. Please try again.'
        setErrorMessage(errorMsg)
        setShowErrorModal(true)
        setErrors(errors)
      },
    })
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    // Navigate back to dashboard with fresh data
    router.visit('/dashboard', { preserveState: false })
  }

  const handleErrorClose = () => {
    setShowErrorModal(false)
  }

  const handleBack = () => {
    router.visit('/dashboard')
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  const amount = parseFloat(formData.amount) || 0
  const currentSafeBalance = balances.safe_balance || 0
  const newSafeBalance = currentSafeBalance + amount

  return (
    <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
      <Sidebar activePage="add-funds" onLogout={handleLogout} />

      <div className="lg:ml-[280px] min-h-screen">
        <TopNav
          title="Add Funds"
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          showBackButton
          onBack={handleBack}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-[840px] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                Add Funds
              </h1>
              <p className="text-sm text-[#9A9A9A] font-light mt-1">
                Top up your account balance securely.
              </p>
            </div>

            {/* Info Card */}
            <AddFundsInfo />

            {/* Current Balance */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111111] rounded-xl border border-[#242424] p-4">
                <p className="text-xs text-[#9A9A9A] font-light">Safe Balance</p>
                <p className="text-xl font-light text-white mt-1">
                  ₱{balances.safe_balance?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div className="bg-[#111111] rounded-xl border border-[#242424] p-4">
                <p className="text-xs text-[#9A9A9A] font-light">Pocket Balance</p>
                <p className="text-xl font-light text-white mt-1">
                  ₱{balances.pocket_balance?.toLocaleString() || '0.00'}
                </p>
              </div>
            </div>

            {/* Form + Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <AddFundsForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={errors}
                  destinations={destinations}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="lg:col-span-2">
                <AddFundsSummary
                  destination={formData.destination}
                  amount={amount}
                  currentSafeBalance={currentSafeBalance}
                  newSafeBalance={newSafeBalance}
                  destinations={destinations}
                />
              </div>
            </div>

            {/* Recent Deposits */}
            {recentDeposits.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-white mb-3">Recent Deposits</h3>
                <div className="space-y-2">
                  {recentDeposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="bg-[#111111] rounded-xl border border-[#242424] p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white">{deposit.description || 'Deposit'}</p>
                        <p className="text-xs text-[#9A9A9A]">
                          {new Date(deposit.created_at).toLocaleDateString('en-PH', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[#5CB85C]">
                        +₱{deposit.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        amount={submittedAmount}
        destination={submittedDestination}
        description={submittedDescription}
        date={submittedDate}
        isSubmitting={isSubmitting}
        destinations={destinations}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        amount={submittedAmount}
        destination={submittedDestination}
        description={submittedDescription}
        date={submittedDate}
        destinations={destinations}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorClose}
        errorMessage={errorMessage}
        amount={submittedAmount}
        destination={submittedDestination}
        destinations={destinations}
      />
    </div>
  )
}

export default AddFunds