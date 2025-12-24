/**
 * LoginForm Component Tests
 * Tests for login form functionality, validation, and submission
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { loginThunk } from '@/store/slices/authSlice'
import { storeAuthTokens, storeAuthUser } from '@/utils/authStorage'

// Mock Redux store
const mockDispatch = vi.fn()
const mockUnwrap = vi.fn()

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

vi.mock('@/store/slices/authSlice', () => ({
  loginThunk: vi.fn(),
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

describe('LoginForm', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockDispatch.mockReturnValue({
      unwrap: mockUnwrap,
    })
  })

  it('renders login form with email and password fields', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when password is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText(/enter password/i) as HTMLInputElement
    const toggleButton = passwordInput.parentElement?.querySelector('button[type="button"]')

    expect(passwordInput.type).toBe('password')

    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')

      await user.click(toggleButton)
      expect(passwordInput.type).toBe('password')
    }
  })

  it('submits form with valid credentials', async () => {
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

    renderWithProviders(<LoginForm onClose={mockOnClose} />)

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const slowMockUnwrap = vi.fn(
      () => new Promise(resolve => setTimeout(() => resolve({
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        accessToken: 'token',
        refreshToken: 'refresh',
      }), 100))
    )

    mockDispatch.mockReturnValue({
      unwrap: slowMockUnwrap,
    })

    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(screen.getByText(/logging in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('calls onClose callback after successful login', async () => {
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

    renderWithProviders(<LoginForm onClose={mockOnClose} />)

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/enter password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    await user.type(emailInput, 't')

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
    })
  })
})
