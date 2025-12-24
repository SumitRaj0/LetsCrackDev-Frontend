/**
 * SearchBar Component Tests
 * Tests for search bar functionality and user interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/components/shared/SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input with default placeholder', () => {
    renderWithProviders(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search for/i)
    expect(input).toBeInTheDocument()
  })

  it('renders search input with custom placeholder', () => {
    renderWithProviders(<SearchBar placeholder="Custom placeholder" />)
    
    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('renders search button', () => {
    renderWithProviders(<SearchBar />)
    
    const button = screen.getByRole('button', { name: /search/i })
    expect(button).toBeInTheDocument()
  })

  it('updates input value when user types', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search for/i) as HTMLInputElement
    await user.type(input, 'react')
    
    expect(input.value).toBe('react')
  })

  it('calls onChange callback when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    renderWithProviders(<SearchBar onChange={handleChange} />)
    
    const input = screen.getByPlaceholderText(/search for/i)
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('uses controlled value when provided', () => {
    renderWithProviders(<SearchBar value="controlled value" />)
    
    const input = screen.getByPlaceholderText(/search for/i) as HTMLInputElement
    expect(input.value).toBe('controlled value')
  })

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    
    renderWithProviders(<SearchBar onSearch={handleSearch} />)
    
    const input = screen.getByPlaceholderText(/search for/i)
    const button = screen.getByRole('button', { name: /search/i })
    
    await user.type(input, 'react')
    await user.click(button)
    
    expect(handleSearch).toHaveBeenCalledWith('react')
  })

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    
    renderWithProviders(<SearchBar onSearch={handleSearch} />)
    
    const input = screen.getByPlaceholderText(/search for/i)
    await user.type(input, 'react{Enter}')
    
    expect(handleSearch).toHaveBeenCalledWith('react')
  })

  it('does not call onSearch when Enter is pressed without handler', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search for/i)
    await user.type(input, 'react{Enter}')
    
    // Should not throw error
    expect(input.value).toBe('react')
  })

  it('maintains internal state when uncontrolled', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    
    renderWithProviders(<SearchBar onSearch={handleSearch} />)
    
    const input = screen.getByPlaceholderText(/search for/i) as HTMLInputElement
    await user.type(input, 'test query')
    
    expect(input.value).toBe('test query')
    
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(handleSearch).toHaveBeenCalledWith('test query')
  })

  it('uses controlled value over internal state', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    
    const { rerender } = renderWithProviders(
      <SearchBar value="initial" onSearch={handleSearch} />
    )
    
    const input = screen.getByPlaceholderText(/search for/i) as HTMLInputElement
    expect(input.value).toBe('initial')
    
    // Update controlled value
    rerender(<SearchBar value="updated" onSearch={handleSearch} />)
    expect(input.value).toBe('updated')
    
    // Typing should not change value if controlled
    await user.type(input, 'new')
    // Value should remain controlled
    expect(input.value).toBe('updated')
  })
})
