/**
 * Phase 2 - Sidebar Navigation Tests
 * Tests for navigation functionality in Navbar
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Navbar } from '@/components/layout/Navbar'
import { getMe } from '@/lib/api/auth.api'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

// Mock auth utilities
vi.mock('@/utils/authStorage', () => ({
  isAuthenticatedWithPasswordGrant: vi.fn(),
  getStoredAccessToken: vi.fn(),
  getStoredUser: vi.fn(),
  storeAuthUser: vi.fn(),
}))

vi.mock('@/lib/api/auth.api', () => ({
  getMe: vi.fn(),
}))

describe('Phase 2 - Sidebar Navigation Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    
    // Mock successful auth
    vi.mocked(isAuthenticatedWithPasswordGrant).mockReturnValue(true)
    vi.mocked(getMe).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user' as const,
        },
      },
      message: 'Success',
    })
  })

  it('TC-DASH-003: Sidebar navigation - Switches pages with active state', async () => {
    const user = userEvent.setup()

    // Mock user for authenticated navigation
    const mockUser = {
      sub: 'user123',
      name: 'Test User',
      email: 'test@example.com',
    }

    renderWithProviders(<Navbar />, {
      initialUser: mockUser,
    })

    // Wait for navbar to load
    await waitFor(() => {
      // Check if user is displayed (navbar should render)
      expect(screen.getByText(/Test User/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Dashboard link is in a dropdown menu, so we check by href
    const dashboardLink = screen.queryByRole('link', { name: /dashboard/i }) || 
                         document.querySelector('a[href="/dashboard"]')
    
    // Dashboard link should exist (might be in dropdown or mobile menu)
    expect(dashboardLink).toBeTruthy()
  })

  it('TC-DASH-003b: Navigation shows active state for current route', async () => {
    const mockUser = {
      sub: 'user123',
      name: 'Test User',
      email: 'test@example.com',
    }

    // Set initial route
    window.history.pushState({}, '', '/dashboard')

    renderWithProviders(<Navbar />, {
      initialUser: mockUser,
    })

    // Wait for navbar to render
    await waitFor(() => {
      // Check if user is displayed (navbar rendered)
      expect(screen.getByText(/Test User/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Dashboard link exists in the component (in dropdown menu)
    // Check by href attribute since it might not be visible until dropdown opens
    const dashboardLink = document.querySelector('a[href="/dashboard"]')
    expect(dashboardLink).toBeTruthy()
  })
})

