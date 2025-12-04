import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { SignupForm } from '@/modules/auth/components/SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
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

        {/* Logo */}
        <div className="flex justify-center mb-6">
          {/* Fixed-height wrapper so modal header height stays stable */}
          <div className="h-16 flex items-center overflow-visible">
            <img
              src="/letscrackdev-logo.png"
              alt="LetsCrackDev logo"
              className="h-40 w-auto object-contain"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Crack the Code. Build the Future.</h2>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Sign in to continue your journey with us'
              : 'Sign up to start your journey with us'}
          </p>
        </div>

        {/* Form */}
        {mode === 'login' ? <LoginForm onClose={onClose} /> : <SignupForm onClose={onClose} />}

        {/* Toggle between Login and Signup */}
        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <span className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Register
              </button>
            </span>
          ) : (
            <span className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}
