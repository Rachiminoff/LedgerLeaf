// resources/js/Components/Auth/DarkLogin.tsx
import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Icon } from '@iconify/react'

interface DarkLoginProps {
  onNavigateToSignUp?: () => void
}

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export const DarkLogin: React.FC<DarkLoginProps> = ({
  onNavigateToSignUp,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const { data, setData, post, processing, errors, reset } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({ email: true, password: true })

    if (!data.email || !validateEmail(data.email) || !data.password || data.password.length < 6) {
      return
    }

    post(route('login'), {
      onSuccess: () => {
        reset('password')
      },
      onError: () => {
        setData('password', '')
      },
    })
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true })
  }

  const getFieldError = (field: 'email' | 'password') => {
    if (!touched[field]) return null
    return errors[field]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Email Field */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] mb-1.5 sm:mb-2 tracking-wide">
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
              getFieldError('email')
                ? 'border-red-500 focus:ring-red-500'
                : touched.email && data.email && !getFieldError('email') && validateEmail(data.email)
                ? 'border-green-500'
                : 'border-[#242424] hover:border-[#3A3A3A]'
            }`}
            required
          />
        </div>
        {getFieldError('email') && (
          <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5">{getFieldError('email')}</p>
        )}
        {touched.email && data.email && !getFieldError('email') && !validateEmail(data.email) && (
          <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5">Please enter a valid email address</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <label className="block text-xs sm:text-sm font-medium text-[#9A9A9A] tracking-wide">
            Password
          </label>
          <button
            type="button"
            onClick={() => window.location.href = route('password.request')}
            className="text-xs sm:text-sm text-[#5CB85C] hover:text-[#6FCF70] transition-all duration-200 hover:underline underline-offset-2 font-medium"
          >
            Forgot password?
          </button>
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
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            disabled={processing}
            className={`w-full bg-[#1A1A1A] text-[#F8F8F8] pl-9 sm:pl-12 pr-9 sm:pr-12 h-11 sm:h-12 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:border-transparent transition-all duration-200 placeholder:text-[#9A9A9A] disabled:opacity-50 disabled:cursor-not-allowed ${
              getFieldError('password')
                ? 'border-red-500 focus:ring-red-500'
                : touched.password && data.password && !getFieldError('password') && data.password.length >= 6
                ? 'border-green-500'
                : 'border-[#242424] hover:border-[#3A3A3A]'
            }`}
            required
            minLength={6}
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
        {getFieldError('password') && (
          <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5">{getFieldError('password')}</p>
        )}
        {touched.password && data.password && !getFieldError('password') && data.password.length < 6 && (
          <p className="text-[10px] sm:text-xs text-red-500 mt-1 sm:mt-1.5">Password must be at least 6 characters</p>
        )}
      </div>

      {/* Custom Checkbox - Remember Me */}
      <div className="flex items-center gap-2.5 group">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="remember"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
            disabled={processing}
            className="sr-only peer"
          />
          <div className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center
            transition-all duration-200 ease-in-out
            ${data.remember
              ? 'bg-[#5CB85C] border-[#5CB85C]'
              : 'bg-[#1A1A1A] border-[#242424] group-hover:border-[#5CB85C]'
            }
            ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}>
            {data.remember && (
              <Icon
                icon="mdi:check"
                className="w-3.5 h-3.5 text-black transition-all duration-200"
              />
            )}
          </div>
        </label>
        <label
          htmlFor="remember"
          className={`
            text-xs sm:text-sm text-[#9A9A9A] cursor-pointer
            transition-colors duration-200
            group-hover:text-[#F8F8F8]
            ${processing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          Remember me
        </label>
      </div>

      {/* Error Message */}
      {errors.email && !touched.email && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-3 sm:p-3.5 animate-shake">
          <p className="text-xs sm:text-sm text-red-400 text-center font-medium">{errors.email}</p>
        </div>
      )}
      {errors.password && !touched.password && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-3 sm:p-3.5 animate-shake">
          <p className="text-xs sm:text-sm text-red-400 text-center font-medium">{errors.password}</p>
        </div>
      )}
      {errors.email && errors.password && !touched.email && !touched.password && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-3 sm:p-3.5 animate-shake">
          <p className="text-xs sm:text-sm text-red-400 text-center font-medium">Invalid credentials</p>
        </div>
      )}

      {/* Sign In Button */}
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
            Signing in...
          </span>
        ) : (
          'Sign in'
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

      {/* Create Account Button */}
      <button
        type="button"
        onClick={onNavigateToSignUp}
        className="w-full bg-transparent text-[#5CB85C] h-11 sm:h-12 rounded-xl font-medium text-sm sm:text-base border border-[#5CB85C] hover:bg-[#5CB85C]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-offset-2 focus:ring-offset-[#111111] flex items-center justify-center space-x-2 group"
      >
        <Icon
          icon="mdi:leaf"
          className="h-4 w-4 sm:h-5 sm:w-5 text-[#5CB85C] group-hover:scale-110 transition-transform duration-200"
        />
        <span>Create an account</span>
      </button>
    </form>
  )
}

export default DarkLogin