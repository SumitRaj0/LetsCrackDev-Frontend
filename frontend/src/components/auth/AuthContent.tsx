/**
 * Shared Auth Content Component
 * Reusable component for both modal and page views
 * Contains logo, welcome message, form, and mode switching
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { SignupForm } from '@/modules/auth/components/SignupForm'

interface AuthContentProps {
  initialMode?: 'login' | 'signup'
  onClose?: () => void
  variant?: 'modal' | 'page'
  showCloseButton?: boolean
  onModeChange?: (mode: 'login' | 'signup') => void
}

export function AuthContent({
  initialMode = 'login',
  onClose,
  variant = 'page',
  showCloseButton = false,
  onModeChange,
}: AuthContentProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode)
    onModeChange?.(newMode)
  }

  const isModal = variant === 'modal'

  return (
    <div className={isModal ? 'p-8' : 'w-full space-y-8'}>
      {/* Close Button (only for modal) */}
      {showCloseButton && isModal && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-800"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="h-16 flex items-center overflow-visible">
          <img
            src="/letscrackdev-logo.png"
            alt="LetsCrackDev logo"
            className="h-40 w-auto object-contain"
          />
        </div>
      </div>

      {/* Welcome Message */}
      <div className={`text-center ${isModal ? 'mb-8' : 'mb-6'}`}>
        <h2
          className={`${isModal ? 'text-3xl' : 'text-3xl'} font-bold ${
            isModal ? 'text-white' : 'text-gray-900 dark:text-white'
          } mb-2`}
        >
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className={isModal ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
          {mode === 'login'
            ? 'Sign in to continue your journey with us'
            : 'Sign up to start your journey with us'}
        </p>
        {!isModal && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Crack the Code. Build the Future.
          </p>
        )}
      </div>

      {/* Form */}
      {mode === 'login' ? (
        <LoginForm onClose={onClose} />
      ) : (
        <SignupForm onClose={onClose} />
      )}

      {/* Toggle between Login and Signup */}
      <div className={`mt-6 text-center text-sm ${isModal ? '' : 'space-y-2'}`}>
        {mode === 'login' ? (
          <>
            <span className={isModal ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
              {isModal ? "Don't have an account? " : 'Or '}
              {isModal ? (
                <button
                  onClick={() => handleModeChange('signup')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Register
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  create a new account
                </Link>
              )}
            </span>
            {!isModal && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link
                    to="/premium"
                    className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    View Pricing
                  </Link>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link
                    to="/forgot"
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    Forgot your password?
                  </Link>
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <span className={isModal ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
              {isModal ? 'Already have an account? ' : 'Already have an account? '}
              {isModal ? (
                <button
                  onClick={() => handleModeChange('login')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Login
                </button>
              ) : (
                <Link
                  to="/login"
                  className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Sign in
                </Link>
              )}
            </span>
            {!isModal && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Link
                  to="/premium"
                  className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  View Pricing
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

