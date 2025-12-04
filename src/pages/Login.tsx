import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/modules/auth/components/LoginForm'

export default function Login() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    // Navigate to dashboard after successful login
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            {/* Fixed-height wrapper so header height stays stable */}
            <div className="h-16 flex items-center overflow-visible">
              <img
                src="/letscrackdev-logo.png"
                alt="LetsCrackDev logo"
                className="h-40 w-auto object-contain"
              />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Crack the Code. Build the Future.
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
            >
              create a new account
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/premium"
              className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
            >
              View Pricing
            </Link>
          </p>
        </div>
        <LoginForm onClose={handleLoginSuccess} />
      </div>
    </div>
  )
}
