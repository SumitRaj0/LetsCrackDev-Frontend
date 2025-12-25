import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'
import { storeAuthTokens, storeAuthUser } from '@/utils/authStorage'
import { useUser } from '@/contexts/UserContext'
import { useAppDispatch } from '@/store/hooks'
import { signupThunk } from '@/store/slices/authSlice'

interface SignupFormProps {
  onClose?: () => void
}

export function SignupForm({ onClose }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
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

    // Real-time field-level validation to show precise messages while typing
    setErrors(prev => {
      const next = { ...prev }

      if (name === 'name') {
        if (!value.trim()) {
          next.name = 'Name is required'
        } else if (value.trim().length < 2) {
          next.name = 'Name must be at least 2 characters'
        } else {
          next.name = undefined
        }
      }

      if (name === 'email') {
        if (!value.trim()) {
          next.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          next.email = 'Email is invalid'
        } else {
          next.email = undefined
        }
      }

      if (name === 'password') {
        const pwd = value
        if (!pwd) {
          next.password = 'Password is required'
        } else if (pwd.length < 8) {
          next.password = 'Password must be at least 8 characters'
        } else if (!/[A-Z]/.test(pwd)) {
          next.password = 'Password must contain at least one uppercase letter'
        } else if (!/[a-z]/.test(pwd)) {
          next.password = 'Password must contain at least one lowercase letter'
        } else if (!/[0-9]/.test(pwd)) {
          next.password = 'Password must contain at least one number'
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
          next.password = 'Password must contain at least one special character'
        } else {
          next.password = undefined
        }

        // Keep confirmPassword in sync when user edits main password
        if (formData.confirmPassword && formData.confirmPassword !== pwd) {
          next.confirmPassword = 'Passwords do not match'
        } else if (name === 'password') {
          // only clear if they now match
          if (formData.confirmPassword === pwd) {
            next.confirmPassword = undefined
          }
        }
      }

      if (name === 'confirmPassword') {
        if (!value) {
          next.confirmPassword = 'Please confirm your password'
        } else if (value !== formData.password) {
          next.confirmPassword = 'Passwords do not match'
        } else {
          next.confirmPassword = undefined
        }
      }

      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      setErrors({})

      // Call Redux thunk to sign up via backend
      const avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(formData.email)}`
      const data = await dispatch(
        signupThunk({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar,
        })
      ).unwrap()

      // Store tokens and user info in local storage (for existing helpers)
      storeAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        idToken: data.accessToken,
        expiresIn: 15 * 60,
      })
      storeAuthUser({
        sub: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.avatar,
        phone: data.user.phone,
        createdAt: data.user.createdAt,
      })

      showSuccess('Account created successfully!')
      onClose?.()

      // Small delay to ensure storage is complete
      await new Promise(resolve => setTimeout(resolve, 100))

      // Refresh user data from storage/context
      await refreshUser()

      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)

      // Let the global handler log/show toast with the backend message
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'SignupForm', action: 'handleSubmit' },
      })

      // Extract a human-friendly message from the thunk rejection / error
      const rawMessage =
        (typeof error === 'string'
          ? error
          : error?.message) || 'An error occurred. Please try again.'
      const message = String(rawMessage)

      // Try to attach the message to the most relevant field so positioning looks correct
      const lowered = message.toLowerCase()
      if (lowered.includes('password')) {
        setErrors(prev => ({ ...prev, password: message }))
      } else if (lowered.includes('email')) {
        setErrors(prev => ({ ...prev, email: message }))
      } else if (lowered.includes('name')) {
        setErrors(prev => ({ ...prev, name: message }))
      } else {
        // Fallback: show a generic error under the email field
        setErrors(prev => ({ ...prev, email: message }))
      }
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Name Input */}
      <div>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Full name"
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

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
            required
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
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
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
      </div>

      {/* Confirm Password Input */}
      <div>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
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
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Signup Button */}
      <Button
        type="submit"
        disabled={isLoading}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  )
}
