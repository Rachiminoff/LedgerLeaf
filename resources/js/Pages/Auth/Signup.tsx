import React from 'react'
import { DarkLayout } from '@/Components/auth/DarkAuthLayout'
import { DarkSignup } from '@/Components/auth/DarkSignup'

const SignupPage: React.FC = () => {
  const handleNavigateToLogin = () => {
    window.location.href = '/login'
  }

  return (
    <DarkLayout
      title="Create account"
      subtitle="Start your journey with LedgerLeaf"
      headerTitle="Create account"
      headerSubtitle="Start your journey with LedgerLeaf"
    >
      <DarkSignup onNavigateToLogin={handleNavigateToLogin} />
    </DarkLayout>
  )
}

export default SignupPage