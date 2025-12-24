/**
 * Card Component Tests
 * Tests for card component variants and props
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { Card } from '@/components/ui/card'

describe('Card', () => {
  it('renders card with default props', () => {
    renderWithProviders(<Card>Card Content</Card>)
    
    const card = screen.getByText('Card Content')
    expect(card).toBeInTheDocument()
  })

  it('renders card with default variant', () => {
    const { container } = renderWithProviders(<Card>Default Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('shadow-sm')
  })

  it('renders card with elevated variant', () => {
    const { container } = renderWithProviders(<Card variant="elevated">Elevated Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('shadow-md')
  })

  it('renders card with outlined variant', () => {
    const { container } = renderWithProviders(<Card variant="outlined">Outlined Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).not.toHaveClass('shadow-sm')
    expect(card).not.toHaveClass('shadow-md')
  })

  it('applies hover effect when hover prop is true', () => {
    const { container } = renderWithProviders(<Card hover>Hover Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('hover:-translate-y-1', 'hover:shadow-xl', 'hover:scale-105')
  })

  it('does not apply hover effect when hover prop is false', () => {
    const { container } = renderWithProviders(<Card hover={false}>No Hover Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).not.toHaveClass('hover:-translate-y-1')
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(<Card className="custom-class">Custom Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('custom-class')
  })

  it('forwards HTML attributes', () => {
    renderWithProviders(
      <Card data-testid="card-test" id="card-id">
        Test Card
      </Card>
    )
    
    const card = screen.getByTestId('card-test')
    expect(card).toHaveAttribute('id', 'card-id')
  })

  it('renders children correctly', () => {
    renderWithProviders(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('has proper base classes', () => {
    const { container } = renderWithProviders(<Card>Base Card</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-xl')
    expect(card).toHaveClass('border')
  })
})


