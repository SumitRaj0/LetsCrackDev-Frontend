/**
 * EmptyState Component Tests
 * Tests for empty state component with actions
 */

import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '@/components/shared/EmptyState'

describe('EmptyState', () => {
  it('renders with title', () => {
    renderWithProviders(<EmptyState title="No items found" />)
    
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('renders with description', () => {
    renderWithProviders(
      <EmptyState 
        title="No items" 
        description="Try adding some items to get started"
      />
    )
    
    expect(screen.getByText('Try adding some items to get started')).toBeInTheDocument()
  })

  it('renders default icon when no icon provided', () => {
    const { container } = renderWithProviders(<EmptyState title="Empty" />)
    
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>
    
    renderWithProviders(<EmptyState title="Empty" icon={customIcon} />)
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders action link when action.to is provided', () => {
    renderWithProviders(
      <EmptyState 
        title="Empty"
        action={{ label: 'Go to Home', to: '/home' }}
      />
    )
    
    const link = screen.getByRole('link', { name: /go to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home')
  })

  it('renders action button when action.onClick is provided', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    renderWithProviders(
      <EmptyState 
        title="Empty"
        action={{ label: 'Click me', onClick: handleClick }}
      />
    )
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not render action when action is not provided', () => {
    renderWithProviders(<EmptyState title="Empty" />)
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = renderWithProviders(<EmptyState title="Empty" />)
    
    const description = container.querySelector('p')
    expect(description).not.toBeInTheDocument()
  })

  it('renders with all props', () => {
    const customIcon = <div data-testid="custom-icon">Icon</div>
    
    renderWithProviders(
      <EmptyState 
        title="Title"
        description="Description"
        icon={customIcon}
        action={{ label: 'Action', to: '/action' }}
      />
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /action/i })).toBeInTheDocument()
  })
})


