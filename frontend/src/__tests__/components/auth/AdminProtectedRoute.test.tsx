/**
 * AdminProtectedRoute Component Tests
 * Tests for admin route protection and access control
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../../utils/testUtils'
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

// Mock auth storage
vi.mock('@/utils/authStorage', () => ({
  isAuthenticatedWithPasswordGrant: vi.fn(),
  getStoredAccessToken: vi.fn(),
  getStoredUser: vi.fn(),
}))

// Mock UserContext
const mockUser = {
  sub: 'user123',
  name: 'Test User',
  email: 'test@example.com',
}

const mockAdminUser = {
  sub: 'admin123',
  name: 'Admin User',
  email: 'admin@example.com',
}

describe('AdminProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows loading spinner when checking authentication', () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)

    renderWithProviders(
      <AdminProtectedRoute>
        <div>Admin Content</div>
      </AdminProtectedRoute>,
      { initialUser: null }
    )

    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeTruthy()
  })

  it('redirects to login when not authenticated', async () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(false)

    renderWithProviders(
      <AdminProtectedRoute>
        <div>Admin Content</div>
      </AdminProtectedRoute>,
      { initialUser: null }
    )

    await waitFor(() => {
      // ProtectedRoute uses Navigate component which redirects
      // In test, we verify protected content is not shown
      const adminContent = screen.queryByText('Admin Content')
      expect(adminContent).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows access denied when user is not admin', async () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)

    renderWithProviders(
      <AdminProtectedRoute>
        <div>Admin Content</div>
      </AdminProtectedRoute>,
      { initialUser: mockUser, initialRole: 'user' }
    )

    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument()
      expect(screen.getByText(/you need admin privileges/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('allows access when user is authenticated and is admin', async () => {
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)

    renderWithProviders(
      <AdminProtectedRoute>
        <div>Admin Content</div>
      </AdminProtectedRoute>,
      { initialUser: mockAdminUser, initialRole: 'admin' }
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument()
      expect(screen.queryByText(/access denied/i)).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
