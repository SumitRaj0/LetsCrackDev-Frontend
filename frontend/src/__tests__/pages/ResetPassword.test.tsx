/**
 * Reset Password Page Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ResetPassword from '@/pages/ResetPassword'
import * as authApi from '@/lib/api/auth.api'
import { useToast } from '@/contexts/ToastContext'

// Mock dependencies
vi.mock('@/lib/api/auth.api')
vi.mock('@/contexts/ToastContext')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  }
})

const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockNavigate = vi.fn()

describe('Reset Password Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useToast as any).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    })
  })

  const renderComponent = (token: string = 'valid-token-123') => {
    return render(
      <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
        <ResetPassword />
      </MemoryRouter>
    )
  }

  it('should render reset password form with valid token', () => {
    renderComponent()

    expect(screen.getByText('Reset Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument()
  })

  it('should redirect to forgot page if token is missing', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <ResetPassword />
      </MemoryRouter>
    )

    expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument()
    expect(mockShowError).toHaveBeenCalledWith('Invalid reset link. Please request a new one.')
  })

  it('should show error for password less than 8 characters', async () => {
    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })

  it('should show error if passwords do not match', async () => {
    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const confirmInput = screen.getByPlaceholderText('Confirm new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    fireEvent.change(confirmInput, { target: { value: 'Different123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('should call resetPassword API on valid form submit', async () => {
    const mockResetPassword = vi.spyOn(authApi, 'resetPassword').mockResolvedValue({
      success: true,
      message: 'Password reset successful',
    })

    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const confirmInput = screen.getByPlaceholderText('Confirm new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('valid-token-123', 'NewPassword123!')
    })
  })

  it('should show success screen after successful reset', async () => {
    vi.spyOn(authApi, 'resetPassword').mockResolvedValue({
      success: true,
      message: 'Password reset successful',
    })

    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const confirmInput = screen.getByPlaceholderText('Confirm new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password Reset Successful!')).toBeInTheDocument()
      expect(mockShowSuccess).toHaveBeenCalled()
    })
  })

  it('should show error on API failure', async () => {
    vi.spyOn(authApi, 'resetPassword').mockRejectedValue({
      response: { data: { error: 'Invalid or expired token' } },
    })

    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const confirmInput = screen.getByPlaceholderText('Confirm new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalled()
    })
  })

  it('should disable form during submission', async () => {
    vi.spyOn(authApi, 'resetPassword').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Success' }), 100))
    )

    renderComponent()

    const passwordInput = screen.getByPlaceholderText('Enter new password')
    const confirmInput = screen.getByPlaceholderText('Confirm new password')
    const submitButton = screen.getByRole('button', { name: /reset password/i })

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Resetting...')
  })
})

