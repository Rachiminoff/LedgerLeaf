// hooks/useAuth.ts
import { useState } from 'react';
import { LoginFormData } from '@/types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    // Mock login - will be replaced with Inertia form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!data.email || !data.password) {
        throw new Error('Please fill in all fields');
      }
      
      if (!data.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Mock success
      console.log('Login successful:', data);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    setError,
  };
};