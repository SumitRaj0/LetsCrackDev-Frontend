/**
 * Button Component Tests
 * Tests for button component variants, sizes, and interactions
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders button with default props', () => {
    renderWithProviders(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders button with primary variant by default', () => {
    const { container } = renderWithProviders(<Button>Primary</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-indigo-600')
  })

  it('renders button with secondary variant', () => {
    const { container } = renderWithProviders(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-gray-200')
  })

  it('renders button with outline variant', () => {
    const { container } = renderWithProviders(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('border')
  })

  it('renders button with ghost variant', () => {
    const { container } = renderWithProviders(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('text-gray-700')
  })

  it('renders button with gradient variant', () => {
    const { container } = renderWithProviders(<Button variant="gradient">Gradient</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-gradient-to-r')
  })

  it('renders button with small size', () => {
    const { container } = renderWithProviders(<Button size="sm">Small</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('renders button with medium size by default', () => {
    const { container } = renderWithProviders(<Button>Medium</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
  })

  it('renders button with large size', () => {
    const { container } = renderWithProviders(<Button size="lg">Large</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('px-6', 'py-3', 'text-base')
  })

  it('renders button with default rounded', () => {
    const { container } = renderWithProviders(<Button>Default</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('rounded-lg')
  })

  it('renders button with full rounded', () => {
    const { container } = renderWithProviders(<Button rounded="full">Full</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('rounded-full')
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button', { name: /click/i })
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <Button className="custom-class">Custom</Button>
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref to button element', () => {
    const ref = { current: null }
    renderWithProviders(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders with type attribute', () => {
    renderWithProviders(<Button type="submit">Submit</Button>)
    
    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toHaveAttribute('type', 'submit')
  })
})
