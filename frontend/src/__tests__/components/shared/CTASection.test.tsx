/**
 * CTASection Component Tests
 * Tests for CTA section component
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { CTASection } from '@/components/shared/CTASection'

describe('CTASection', () => {
  it('renders title and description', () => {
    renderWithProviders(
      <CTASection 
        title="Get Started Today" 
        description="Join thousands of developers"
      />
    )
    
    expect(screen.getByText('Get Started Today')).toBeInTheDocument()
    expect(screen.getByText('Join thousands of developers')).toBeInTheDocument()
  })

  it('renders primary button when provided', () => {
    renderWithProviders(
      <CTASection 
        title="Title"
        description="Description"
        primaryButton={{ text: 'Get Started', to: '/signup' }}
      />
    )
    
    const link = screen.getByRole('link', { name: /get started/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/signup')
  })

  it('renders secondary button when provided', () => {
    renderWithProviders(
      <CTASection 
        title="Title"
        description="Description"
        secondaryButton={{ text: 'Learn More', to: '/about' }}
      />
    )
    
    const link = screen.getByRole('link', { name: /learn more/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })

  it('renders both buttons when provided', () => {
    renderWithProviders(
      <CTASection 
        title="Title"
        description="Description"
        primaryButton={{ text: 'Primary', to: '/primary' }}
        secondaryButton={{ text: 'Secondary', to: '/secondary' }}
      />
    )
    
    expect(screen.getByRole('link', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /secondary/i })).toBeInTheDocument()
  })

  it('renders children content', () => {
    renderWithProviders(
      <CTASection title="Title" description="Description">
        <div data-testid="child-content">Child Content</div>
      </CTASection>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('does not render buttons when not provided', () => {
    const { container } = renderWithProviders(
      <CTASection title="Title" description="Description" />
    )
    
    // Buttons container should not be rendered
    const buttonsContainer = container.querySelector('.flex.flex-col')
    expect(buttonsContainer).not.toBeInTheDocument()
  })

  it('has proper gradient background classes', () => {
    const { container } = renderWithProviders(
      <CTASection title="Title" description="Description" />
    )
    
    const section = container.querySelector('.bg-gradient-to-r')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('from-indigo-600', 'via-purple-600', 'to-pink-600')
  })
})


