/**
 * LoadingSpinner Component Tests
 * Tests for loading spinner display and variants
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders spinner with default size', () => {
    const { container } = renderWithProviders(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('h-8', 'w-8') // Default md size
  })

  it('renders spinner with small size', () => {
    const { container } = renderWithProviders(<LoadingSpinner size="sm" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('renders spinner with large size', () => {
    const { container } = renderWithProviders(<LoadingSpinner size="lg" />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })

  it('renders full screen spinner when fullScreen prop is true', () => {
    const { container } = renderWithProviders(<LoadingSpinner fullScreen />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('min-h-screen')
  })

  it('shows loading text when showText prop is true', () => {
    renderWithProviders(<LoadingSpinner showText />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('does not show loading text when showText prop is false', () => {
    renderWithProviders(<LoadingSpinner showText={false} />)
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <LoadingSpinner className="custom-class" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })

  it('renders with fullScreen and showText together', () => {
    const { container } = renderWithProviders(
      <LoadingSpinner fullScreen showText />
    )
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('min-h-screen')
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
