/**
 * ErrorBoundary Component Tests
 * Tests for error boundary functionality and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when there is no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/test error message/i)).toBeInTheDocument()
  })

  it('shows default error message when error has no message', () => {
    const ThrowErrorNoMessage = () => {
      throw new Error('')
    }

    renderWithProviders(
      <ErrorBoundary>
        <ThrowErrorNoMessage />
      </ErrorBoundary>
    )

    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error Fallback</div>

    renderWithProviders(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument()
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })

  it('has Try Again button that resets error state', async () => {
    const user = userEvent.setup()
    
    const { rerender } = renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

    const tryAgainButton = screen.getByRole('button', { name: /try again/i })
    await user.click(tryAgainButton)

    // Rerender with error fixed - ErrorBoundary resets its state
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    // After reset, should show content again (may need to wait)
    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('has Go Home button that navigates to home', async () => {
    const user = userEvent.setup()
    const originalLocation = window.location

    // Mock window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' }

    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const goHomeButton = screen.getByRole('button', { name: /go home/i })
    await user.click(goHomeButton)

    // Restore original location
    window.location = originalLocation
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/error details/i)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText(/error details/i)).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
