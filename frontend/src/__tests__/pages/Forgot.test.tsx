/**
 * Forgot Password Page Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Forgot from '@/pages/Forgot'
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

describe('Forgot Password Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useToast as any).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    })
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Forgot />
      </BrowserRouter>
    )
  }

  it('should render forgot password form', () => {
    renderComponent()

    expect(screen.getByText('Forgot Password?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('should prevent form submission with empty email (HTML5 validation)', async () => {
    renderComponent()

    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    // HTML5 validation prevents submission when required field is empty
    // So we test that the form doesn't submit by checking API is not called
    const mockForgotPassword = vi.spyOn(authApi, 'forgotPassword')
    
    fireEvent.click(submitButton)

    // Wait a bit to ensure no API call was made
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(mockForgotPassword).not.toHaveBeenCalled()
  })

  it('should show error for whitespace-only email (programmatic validation)', async () => {
    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    // Set email to whitespace only - this bypasses HTML5 required validation
    // but should be caught by JavaScript validation
    fireEvent.change(emailInput, { target: { value: '   ' } })
    
    // Bypass HTML5 validation by directly calling submit
    const form = emailInput.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Please enter your email address')
    })
  })

  it('should call forgotPassword API on form submit', async () => {
    const mockForgotPassword = vi.spyOn(authApi, 'forgotPassword').mockResolvedValue({
      success: true,
      message: 'Reset link sent',
    })

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('should show success message after successful submission', async () => {
    vi.spyOn(authApi, 'forgotPassword').mockResolvedValue({
      success: true,
      message: 'Reset link sent',
    })

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalled()
      expect(screen.getByText('Check Your Email')).toBeInTheDocument()
    })
  })

  it('should show reset URL in development mode', async () => {
    const resetUrl = 'http://localhost:5173/reset-password?token=abc123'
    vi.spyOn(authApi, 'forgotPassword').mockResolvedValue({
      success: true,
      data: { resetUrl },
      message: 'Reset link sent',
    })

    const consoleSpy = vi.spyOn(console, 'log')

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('🔗 Password Reset Link:', resetUrl)
    })
  })

  it('should show error message on API failure', async () => {
    vi.spyOn(authApi, 'forgotPassword').mockRejectedValue({
      response: { data: { error: 'API Error' } },
    })

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalled()
    })
  })

  it('should disable form during submission', async () => {
    vi.spyOn(authApi, 'forgotPassword').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Sent' }), 100))
    )

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Sending...')
  })

  it('should show success screen after submission', async () => {
    vi.spyOn(authApi, 'forgotPassword').mockResolvedValue({
      success: true,
      message: 'Reset link sent',
    })

    renderComponent()

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument()
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
    })
  })
})

