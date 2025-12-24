/**
 * SignupForm Component Tests
 * Tests for signup form functionality, validation, and submission
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/modules/auth/components/SignupForm'
import { signupThunk } from '@/store/slices/authSlice'
import { storeAuthTokens, storeAuthUser } from '@/utils/authStorage'

// Mock Redux store
const mockDispatch = vi.fn()
const mockUnwrap = vi.fn()

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

vi.mock('@/store/slices/authSlice', () => ({
  signupThunk: vi.fn(),
}))

// Mock auth storage
vi.mock('@/utils/authStorage', () => ({
  storeAuthTokens: vi.fn(),
  storeAuthUser: vi.fn(),
  isAuthenticatedWithPasswordGrant: vi.fn(() => true),
  getStoredAccessToken: vi.fn(),
  getStoredUser: vi.fn(),
}))

// Mock contexts
vi.mock('@/contexts/ErrorContext', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}))

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}))

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    refreshUser: vi.fn(() => Promise.resolve()),
  }),
}))

describe('SignupForm', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockDispatch.mockReturnValue({
      unwrap: mockUnwrap,
    })
  })

  it('renders signup form with all required fields', () => {
    renderWithProviders(<SignupForm />)

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when email is invalid', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when password is too short', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password456')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility for both password fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    const passwordInput = screen.getByPlaceholderText(/enter password/i) as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i) as HTMLInputElement

    expect(passwordInput.type).toBe('password')
    expect(confirmPasswordInput.type).toBe('password')

    // Toggle password field
    const passwordToggle = passwordInput.parentElement?.querySelector('button[type="button"]')
    if (passwordToggle) {
      await user.click(passwordToggle)
      expect(passwordInput.type).toBe('text')
    }

    // Toggle confirm password field
    const confirmPasswordToggle = confirmPasswordInput.parentElement?.querySelector('button[type="button"]')
    if (confirmPasswordToggle) {
      await user.click(confirmPasswordToggle)
      expect(confirmPasswordInput.type).toBe('text')
    }
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockUnwrap.mockResolvedValue({
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        phone: '1234567890',
        createdAt: '2024-01-01',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    renderWithProviders(<SignupForm onClose={mockOnClose} />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockUnwrap.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        accessToken: 'token',
        refreshToken: 'refresh',
      }), 100))
    )

    renderWithProviders(<SignupForm />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('calls onClose callback after successful signup', async () => {
    const user = userEvent.setup()
    mockUnwrap.mockResolvedValue({
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'avatar.jpg',
        phone: '1234567890',
        createdAt: '2024-01-01',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    renderWithProviders(<SignupForm onClose={mockOnClose} />)

    const nameInput = screen.getByPlaceholderText(/full name/i)
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
})
