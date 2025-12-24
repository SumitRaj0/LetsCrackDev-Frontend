/**
 * Input Component Tests
 * Tests for input component variants and interactions
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders input element', () => {
    renderWithProviders(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders input with default rounded', () => {
    const { container } = renderWithProviders(<Input />)
    const input = container.querySelector('input')
    expect(input).toHaveClass('rounded-lg')
  })

  it('renders input with full rounded', () => {
    const { container } = renderWithProviders(<Input rounded="full" />)
    const input = container.querySelector('input')
    expect(input).toHaveClass('rounded-full')
  })

  it('updates value when user types', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Input />)
    
    const input = screen.getByRole('textbox') as HTMLInputElement
    await user.type(input, 'test input')
    
    expect(input.value).toBe('test input')
  })

  it('accepts value prop for controlled input', () => {
    renderWithProviders(<Input value="controlled value" onChange={() => {}} />)
    
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('controlled value')
  })

  it('calls onChange handler when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    renderWithProviders(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 't')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('accepts placeholder prop', () => {
    renderWithProviders(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('accepts type prop', () => {
    renderWithProviders(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('is required when required prop is true', () => {
    renderWithProviders(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <Input className="custom-class" />
    )
    const input = container.querySelector('input')
    expect(input).toHaveClass('custom-class')
  })

  it('forwards ref to input element', () => {
    const ref = { current: null }
    renderWithProviders(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts all standard input attributes', () => {
    renderWithProviders(
      <Input
        id="test-input"
        name="test"
        autoComplete="off"
        maxLength={10}
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('name', 'test')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAttribute('maxlength', '10')
  })
})
