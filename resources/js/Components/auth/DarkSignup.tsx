// resources/js/Components/Auth/DarkSignup.tsx
import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Icon } from '@iconify/react'
import TermsModal from '@/Components/ui/TermsModal'
import PrivacyModal from '@/Components/ui/PrivacyModal'

interface DarkSignupProps {
  onNavigateToLogin?: () => void
}

interface SignupFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const DarkSignup: React.FC<DarkSignupProps> = ({
  onNavigateToLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
  })
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  // Only destructure what we actually use
  const { data, setData, post, processing, errors } = useForm<SignupFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const passwordsMatch = () => {
    return data.password === data.password_confirmation
  }

  const getPasswordStrength = () => {
    const password = data.password
    if (!password) return { score: 0, label: 'Weak', color: 'text-red-500' }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500']

    return { score, label: labels[score], color: colors[score] }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      password_confirmation: true,
    })

    // Client-side validation
    if (!data.name || !data.name.trim()) {
      return
    }

    if (!data.email || !validateEmail(data.email)) {
      return
    }

    if (!data.password || !validatePassword(data.password)) {
      return
    }

    if (!passwordsMatch()) {
      return
    }

    if (!termsAccepted) {
      setGeneralError('Please accept the Terms of Service')
      return
    }

    if (!privacyAccepted) {
      setGeneralError('Please accept the Privacy Policy')
      return
    }

    post(route('register'), {
      preserveScroll: true,
      onSuccess: () => {
        setGeneralError(null)
        // Reset password fields on success
        setData('password', '')
        setData('password_confirmation', '')
      },
      onError: (error) => {
        console.log('Registration errors:', error) // Debug: Log errors to console
        setData('password', '')
        setData('password_confirmation', '')
        
        // Handle specific error messages
        if (error.email) {
          // Email already registered or invalid
          setGeneralError(error.email)
          // Also set field-specific error
          errors.email = error.email
        } else if (error.name) {
          setGeneralError(error.name)
          errors.name = error.name
        } else if (error.password) {
          setGeneralError(error.password)
          errors.password = error.password
        } else if (error.password_confirmation) {
          setGeneralError(error.password_confirmation)
          errors.password_confirmation = error.password_confirmation
        } else if (typeof error === 'object' && error !== null) {
          // Handle Laravel validation errors object
          const firstError = Object.values(error as Record<string, unknown>)[0]
          if (typeof firstError === 'string') {
            setGeneralError(firstError)
          } else if (Array.isArray(firstError) && firstError.length > 0) {
            setGeneralError(firstError[0] as string)
          } else {
            setGeneralError('Something went wrong. Please try again.')
          }
        } else {
          setGeneralError('Something went wrong. Please try again.')
        }
      },
    })
  }

  const handleBlur = (field: 'name' | 'email' | 'password' | 'password_confirmation') => {
    setTouched({ ...touched, [field]: true })
  }

  const getFieldError = (field: 'name' | 'email' | 'password' | 'password_confirmation') => {
    if (!touched[field]) return null
    return errors[field]
  }

  const getClientError = (field: 'name' | 'email' | 'password' | 'password_confirmation') => {
    if (!touched[field]) return null

    switch (field) {
      case 'name':
        if (!data.name || !data.name.trim()) {
          return 'Full name is required'
        }
        return null
      case 'email':
        if (!data.email) return 'Email is required'
        if (!validateEmail(data.email)) return 'Please enter a valid email'
        return null
      case 'password':
        if (!data.password) return 'Password is required'
        if (!validatePassword(data.password)) return 'Password must be at least 8 characters'
        return null
      case 'password_confirmation':
        if (!data.password_confirmation) return 'Please confirm your password'
        if (!passwordsMatch()) return 'Passwords do not match'
        return null
      default:
        return null
    }
  }

  const passwordStrength = getPasswordStrength()

  const showFieldError = (field: 'name' | 'email' | 'password' | 'password_confirmation') => {
    // Check for field-specific errors from server
    if (errors[field]) return errors[field]
    return getClientError(field)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* General Error Message - Shows "The email has already been taken" */}
        {generalError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4 flex items-start gap-2.5">
            <Icon icon="mdi:alert-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-500">{generalError}</p>
          </div>
        )}

        {/* Full Name Field */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Full name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Icon
                icon="mdi:account-outline"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[#9A9A9A] group-focus-within:text-[#5CB85C] transition-colors duration-200"
              />
            </div>
            <input
              type="text"
              placeholder="Enter your full name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              disabled={processing}
              className={`w-full bg-[#1A1A1A] text-[#F8F8F8] pl-9 sm:pl-12 pr-3 sm:pr-4 h-11 sm:h-12 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
                showFieldError('name')
                  ? 'border-red-500 focus:ring-red-500'
                  : touched.name && data.name && !showFieldError('name')
                  ? 'border-green-500'
                  : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
              required
            />
          </div>
          {showFieldError('name') && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              {showFieldError('name')}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Email address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Icon
                icon="mdi:email-outline"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[#9A9A9A] group-focus-within:text-[#5CB85C] transition-colors duration-200"
              />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={processing}
              className={`w-full bg-[#1A1A1A] text-[#F8F8F8] pl-9 sm:pl-12 pr-3 sm:pr-4 h-11 sm:h-12 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
                showFieldError('email') || errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : touched.email && data.email && !showFieldError('email')
                  ? 'border-green-500'
                  : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
              required
            />
          </div>
          {showFieldError('email') && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              {showFieldError('email')}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] tracking-wide">
              Password
            </label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Icon
                icon="mdi:lock-outline"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[#9A9A9A] group-focus-within:text-[#5CB85C] transition-colors duration-200"
              />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              disabled={processing}
              className={`w-full bg-[#1A1A1A] text-[#F8F8F8] pl-9 sm:pl-12 pr-9 sm:pr-12 h-11 sm:h-12 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
                showFieldError('password')
                  ? 'border-red-500 focus:ring-red-500'
                  : touched.password && data.password && !showFieldError('password') && validatePassword(data.password)
                  ? 'border-green-500'
                  : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-[#9A9A9A] hover:text-[#F8F8F8] transition-colors duration-200 min-h-[44px] min-w-[44px] justify-center"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
            </button>
          </div>

          {touched.password && data.password && !showFieldError('password') && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#242424] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score === 0 ? 'w-0' :
                      passwordStrength.score === 1 ? 'w-1/5 bg-red-500' :
                      passwordStrength.score === 2 ? 'w-2/5 bg-orange-500' :
                      passwordStrength.score === 3 ? 'w-3/5 bg-yellow-500' :
                      passwordStrength.score === 4 ? 'w-4/5 bg-green-500' :
                      'w-full bg-emerald-500'
                    }`}
                  />
                </div>
                <span className={`text-[10px] sm:text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-0.5 text-[10px] sm:text-xs">
                <p className={`flex items-center gap-1 ${data.password.length >= 8 ? 'text-green-500' : 'text-[#9A9A9A]'}`}>
                  <span>{data.password.length >= 8 ? '✓' : '○'}</span>
                  8+ chars
                </p>
                <p className={`flex items-center gap-1 ${/[A-Z]/.test(data.password) ? 'text-green-500' : 'text-[#9A9A9A]'}`}>
                  <span>{/[A-Z]/.test(data.password) ? '✓' : '○'}</span>
                  Uppercase
                </p>
                <p className={`flex items-center gap-1 ${/[0-9]/.test(data.password) ? 'text-green-500' : 'text-[#9A9A9A]'}`}>
                  <span>{/[0-9]/.test(data.password) ? '✓' : '○'}</span>
                  Number
                </p>
                <p className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(data.password) ? 'text-green-500' : 'text-[#9A9A9A]'}`}>
                  <span>{/[^A-Za-z0-9]/.test(data.password) ? '✓' : '○'}</span>
                  Special
                </p>
              </div>
            </div>
          )}

          {showFieldError('password') && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              {showFieldError('password')}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] mb-1.5 tracking-wide">
            Confirm password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Icon
                icon="mdi:lock-check-outline"
                className="h-4 w-4 sm:h-5 sm:w-5 text-[#9A9A9A] group-focus-within:text-[#5CB85C] transition-colors duration-200"
              />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              onBlur={() => handleBlur('password_confirmation')}
              disabled={processing}
              className={`w-full bg-[#1A1A1A] text-[#F8F8F8] pl-9 sm:pl-12 pr-9 sm:pr-12 h-11 sm:h-12 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
                showFieldError('password_confirmation')
                  ? 'border-red-500 focus:ring-red-500'
                  : touched.password_confirmation && data.password_confirmation && !showFieldError('password_confirmation') && passwordsMatch()
                  ? 'border-green-500'
                  : touched.password_confirmation && data.password_confirmation && !showFieldError('password_confirmation') && !passwordsMatch()
                  ? 'border-red-500'
                  : 'border-[#242424] hover:border-[#3A3A3A]'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-[#9A9A9A] hover:text-[#F8F8F8] transition-colors duration-200 min-h-[44px] min-w-[44px] justify-center"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                icon={showConfirmPassword ? 'mdi:eye' : 'mdi:eye-off'}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
            </button>
          </div>

          {touched.password_confirmation && data.password_confirmation && !showFieldError('password_confirmation') && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Icon
                icon={passwordsMatch() ? 'mdi:check-circle' : 'mdi:close-circle'}
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${passwordsMatch() ? 'text-green-500' : 'text-red-500'}`}
              />
              <span className={`text-[10px] sm:text-xs ${passwordsMatch() ? 'text-green-500' : 'text-red-500'}`}>
                {passwordsMatch() ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}

          {showFieldError('password_confirmation') && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              {showFieldError('password_confirmation')}
            </p>
          )}
        </div>

        {/* Terms Acceptance Section */}
        <div className="space-y-2.5 pt-1">
          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked)
                  if (generalError === 'Please accept the Terms of Service') {
                    setGeneralError(null)
                  }
                }}
                disabled={processing}
                className="sr-only"
              />
              <div className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                ${termsAccepted
                  ? 'bg-[#5CB85C] border-[#5CB85C]'
                  : 'bg-[#1A1A1A] border-[#242424] group-hover:border-[#5CB85C]'
                }
                ${processing ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
                {termsAccepted && (
                  <Icon
                    icon="mdi:check"
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black transition-all duration-200"
                  />
                )}
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-[#9A9A9A] leading-relaxed group-hover:text-[#F8F8F8] transition-colors duration-200">
              I have read and agree to the{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-[#5CB85C] hover:text-[#6FCF70] transition-colors hover:underline focus:outline-none"
              >
                Terms of Service
              </button>
            </span>
          </label>

          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked)
                  if (generalError === 'Please accept the Privacy Policy') {
                    setGeneralError(null)
                  }
                }}
                disabled={processing}
                className="sr-only"
              />
              <div className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                ${privacyAccepted
                  ? 'bg-[#5CB85C] border-[#5CB85C]'
                  : 'bg-[#1A1A1A] border-[#242424] group-hover:border-[#5CB85C]'
                }
                ${processing ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
                {privacyAccepted && (
                  <Icon
                    icon="mdi:check"
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black transition-all duration-200"
                  />
                )}
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-[#9A9A9A] leading-relaxed group-hover:text-[#F8F8F8] transition-colors duration-200">
              I have read and agree to the{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-[#5CB85C] hover:text-[#6FCF70] transition-colors hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
            </span>
          </label>

          {/* Terms Error Message */}
          {generalError === 'Please accept the Terms of Service' && (
            <p className="text-[10px] sm:text-xs text-red-500 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              Please accept the Terms of Service
            </p>
          )}
          {generalError === 'Please accept the Privacy Policy' && (
            <p className="text-[10px] sm:text-xs text-red-500 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" className="w-3 h-3" />
              Please accept the Privacy Policy
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-[#5CB85C] text-black h-11 sm:h-12 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#6FCF70] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-offset-2 focus:ring-offset-[#111111] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#242424]" />
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-3 sm:px-4 bg-[#111111] text-[#9A9A9A] font-light tracking-wide">or</span>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="w-full bg-transparent text-[#5CB85C] h-11 sm:h-12 rounded-xl font-medium text-sm sm:text-base border border-[#5CB85C] hover:bg-[#5CB85C]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-offset-2 focus:ring-offset-[#111111] flex items-center justify-center space-x-2 group"
        >
          <Icon
            icon="mdi:login"
            className="h-4 w-4 sm:h-5 sm:w-5 text-[#5CB85C] group-hover:scale-110 transition-transform duration-200"
          />
          <span>Sign in to existing account</span>
        </button>
      </form>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true)
          setShowTermsModal(false)
          setGeneralError(null)
        }}
      />

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setPrivacyAccepted(true)
          setShowPrivacyModal(false)
          setGeneralError(null)
        }}
      />
    </>
  )
}

export default DarkSignup