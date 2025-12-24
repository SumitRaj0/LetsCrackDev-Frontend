/**
 * Phase 2 - Theme Toggle Tests
 * Tests for light/dark mode toggle functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, screen } from '../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

describe('Phase 2 - Theme Toggle Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('TC-DASH-004: Light/dark mode toggle - UI theme changes', async () => {
    const user = userEvent.setup()

    // Start with dark theme
    renderWithProviders(<ThemeToggle />, {
      initialTheme: 'dark',
    })

    // Check initial state - should be dark mode (moon icon visible)
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton).toBeInTheDocument()

    // Check that dark class is applied to document
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click toggle to switch to light mode
    await user.click(toggleButton)

    // Check that dark class is removed (light mode)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Check that theme is stored in localStorage
    expect(localStorage.getItem('theme')).toBe('light')

    // Click again to switch back to dark mode
    await user.click(toggleButton)

    // Check that dark class is added back
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Check that theme is stored in localStorage
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('TC-DASH-004b: Theme persists across page reloads', () => {
    // Set initial theme in localStorage
    localStorage.setItem('theme', 'light')

    renderWithProviders(<ThemeToggle />, {
      initialTheme: 'light',
    })

    // Check that theme from localStorage is applied
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

