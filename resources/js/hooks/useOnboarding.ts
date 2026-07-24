import { useState, useEffect, useCallback } from 'react'

const ONBOARDING_COMPLETED_KEY = 'ledgerleaf_onboarding_completed'

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    // Check localStorage for onboarding status
    const stored = localStorage.getItem(ONBOARDING_COMPLETED_KEY)
    return stored === 'true'
  })

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false)

  useEffect(() => {
    // Show welcome modal if onboarding is not completed
    if (!isOnboardingComplete) {
      setShowWelcomeModal(true)
    }
  }, [isOnboardingComplete])

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true')
    setIsOnboardingComplete(true)
    setShowWelcomeModal(false)
  }, [])

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY)
    setIsOnboardingComplete(false)
    setShowWelcomeModal(true)
  }, [])

  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false)
  }, [])

  return {
    showWelcomeModal,
    isOnboardingComplete,
    completeOnboarding,
    dismissWelcomeModal,
    resetOnboarding
  }
}

export default useOnboarding