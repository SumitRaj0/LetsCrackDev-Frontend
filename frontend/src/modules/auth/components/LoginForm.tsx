import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'
import { storeAuthTokens, storeAuthUser } from '@/utils/authStorage'
import { useUser } from '@/contexts/UserContext'
import { useAppDispatch } from '@/store/hooks'
import { loginThunk } from '@/store/slices/authSlice'

interface LoginFormProps {
  onClose?: () => void
}

export function LoginForm({ onClose }: LoginFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { handleError } = useErrorHandler()
  const { showSuccess } = useToast()
  const { refreshUser } = useUser()
  const dispatch = useAppDispatch()

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!formData.password) {
      setErrors({ password: 'Password is required' })
      return
    }

    try {
      setIsLoading(true)
      setErrors({})

      // Login with email and password via Redux thunk
      const result = await dispatch(
        loginThunk({ email: formData.email, password: formData.password })
      ).unwrap()

      if (!result?.user) {
        throw new Error('Login failed: empty response')
      }

      // Store tokens using our custom storage
      storeAuthTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        idToken: result.accessToken,
        expiresIn: 15 * 60,
      })
      storeAuthUser({
        sub: result.user.id,
        email: result.user.email,
        name: result.user.name,
        picture: result.user.avatar,
        phone: result.user.phone,
        createdAt: result.user.createdAt,
      })
      
      // Show success and close modal
      showSuccess('Login successful!')
      onClose?.()
      
      // Small delay to ensure storage is complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Refresh user data from storage/context
      await refreshUser()

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'LoginForm', action: 'handleSubmit' },
      })
      setErrors({ email: 'An error occurred. Please try again.' })
    }
  }

  const handleForgotPassword = () => {
    // Close modal if open
    onClose?.()
    // Navigate to forgot password page
    navigate('/forgot')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-indigo-500/50 transition-all duration-200"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
