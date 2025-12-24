/**
 * ProtectedRoute Tests
 * Tests authentication and redirect logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../utils/testUtils'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

// Mock auth storage
vi.mock('@/utils/authStorage', () => ({
  isAuthenticatedWithPasswordGrant: vi.fn(),
  getStoredAccessToken: vi.fn(),
  getStoredUser: vi.fn(),
}))

describe('ProtectedRoute - Auth Logic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('TC-PROT-001: Allows access when authenticated', async () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)

    const mockUser = {
      sub: 'user123',
      name: 'Test User',
      email: 'test@example.com',
    }

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialUser: mockUser }
    )

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('TC-PROT-002: Shows loading when checking authentication', () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)

    // User context will be loading initially
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialUser: null }
    )

    // Should show loading spinner initially
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeTruthy()
  })

  it('TC-PROT-003: Redirects to login when not authenticated', async () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(false)

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialUser: null }
    )

    await waitFor(() => {
      // ProtectedRoute uses Navigate component which redirects
      // In test, we verify protected content is not shown
      const protectedContent = screen.queryByText('Protected Content')
      // Content should not be visible when not authenticated
      expect(protectedContent).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

