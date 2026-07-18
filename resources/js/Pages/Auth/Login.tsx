import React from 'react';
import { DarkLayout } from '@/Components/auth/DarkAuthLayout';
import { DarkLogin } from '@/Components/auth/DarkLogin';

const LoginPage: React.FC = () => {
  const handleLoginSuccess = () => {
    console.log('Login successful - redirecting to dashboard...');
    // Use window.location directly
    window.location.href = '/dashboard';
  };

  const handleNavigateToSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <DarkLayout
      title="Welcome"
      subtitle="Sign in to continue to LedgerLeaf"
      headerTitle="Welcome back"
      headerSubtitle="Sign in to continue to LedgerLeaf"
    >
      <DarkLogin
        onSuccess={handleLoginSuccess}
        onNavigateToSignUp={handleNavigateToSignUp}
      />
    </DarkLayout>
  );
};

export default LoginPage;