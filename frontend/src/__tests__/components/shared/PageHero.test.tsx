/**
 * PageHero Component Tests
 * Tests for page hero component
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { PageHero } from '@/components/shared/PageHero'

describe('PageHero', () => {
  it('renders title and description', () => {
    renderWithProviders(
      <PageHero 
        title="Page Title" 
        description="Page description text"
      />
    )
    
    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('Page description text')).toBeInTheDocument()
  })

  it('renders title as h1 element', () => {
    renderWithProviders(
      <PageHero 
        title="Test Title" 
        description="Description"
      />
    )
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('Test Title')
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <PageHero 
        title="Title" 
        description="Description"
        className="custom-class"
      />
    )
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('custom-class')
  })

  it('has proper base classes', () => {
    const { container } = renderWithProviders(
      <PageHero title="Title" description="Description" />
    )
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('pt-24', 'pb-12')
  })

  it('handles long titles', () => {
    const longTitle = 'This is a very long page title that should still render correctly'
    
    renderWithProviders(
      <PageHero title={longTitle} description="Description" />
    )
    
    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })

  it('handles long descriptions', () => {
    const longDescription = 'This is a very long description that should wrap properly and still be readable on the page'
    
    renderWithProviders(
      <PageHero title="Title" description={longDescription} />
    )
    
    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })
})


