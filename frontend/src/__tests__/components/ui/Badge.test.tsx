/**
 * Badge Component Tests
 * Tests for badge component variants and sizes
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders badge with default props', () => {
    renderWithProviders(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
  })

  it('renders badge with default variant', () => {
    const { container } = renderWithProviders(<Badge>Default</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-gray-100')
  })

  it('renders badge with primary variant', () => {
    const { container } = renderWithProviders(<Badge variant="primary">Primary</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-indigo-100')
  })

  it('renders badge with success variant', () => {
    const { container } = renderWithProviders(<Badge variant="success">Success</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-green-100')
  })

  it('renders badge with warning variant', () => {
    const { container } = renderWithProviders(<Badge variant="warning">Warning</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-yellow-100')
  })

  it('renders badge with error variant', () => {
    const { container } = renderWithProviders(<Badge variant="error">Error</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-red-100')
  })

  it('renders badge with info variant', () => {
    const { container } = renderWithProviders(<Badge variant="info">Info</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('renders badge with small size', () => {
    const { container } = renderWithProviders(<Badge size="sm">Small</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs')
  })

  it('renders badge with medium size by default', () => {
    const { container } = renderWithProviders(<Badge>Medium</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-xs')
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(<Badge className="custom-class">Custom</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('custom-class')
  })

  it('has rounded-full class', () => {
    const { container } = renderWithProviders(<Badge>Rounded</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('rounded-full')
  })

  it('forwards HTML attributes', () => {
    renderWithProviders(<Badge data-testid="badge-test" id="badge-id">Test</Badge>)
    
    const badge = screen.getByTestId('badge-test')
    expect(badge).toHaveAttribute('id', 'badge-id')
  })

  it('renders as inline-flex element', () => {
    const { container } = renderWithProviders(<Badge>Inline</Badge>)
    const badge = container.firstChild as HTMLElement
    
    expect(badge).toHaveClass('inline-flex')
  })
})


