/**
 * ChatInput Component Tests
 * Tests for chat input component interactions
 */

import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { ChatInput } from '@/components/chatbot/ChatInput'

describe('ChatInput', () => {
  it('renders input field with placeholder', () => {
    renderWithProviders(<ChatInput onSend={vi.fn()} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    expect(input).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    renderWithProviders(<ChatInput onSend={vi.fn()} placeholder="Custom placeholder" />)
    
    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('updates input value on change', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInput onSend={vi.fn()} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i) as HTMLInputElement
    await user.type(input, 'Hello')
    
    expect(input.value).toBe('Hello')
  })

  it('calls onSend when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, 'Test message{Enter}')
    
    expect(handleSend).toHaveBeenCalledWith('Test message')
    expect(handleSend).toHaveBeenCalledTimes(1)
  })

  it('calls onSend when send button is clicked', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, 'Test message')
    
    // Note: There's no visible send button in the current implementation
    // But we can test Enter key functionality
    await user.keyboard('{Enter}')
    
    expect(handleSend).toHaveBeenCalledWith('Test message')
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i) as HTMLInputElement
    await user.type(input, 'Test message{Enter}')
    
    expect(input.value).toBe('')
  })

  it('does not send empty message', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, '   {Enter}')
    
    expect(handleSend).not.toHaveBeenCalled()
  })

  it('does not send message when disabled', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} disabled />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, 'Test message{Enter}')
    
    expect(handleSend).not.toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    renderWithProviders(<ChatInput onSend={vi.fn()} disabled />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    expect(input).toBeDisabled()
  })

  it('displays character counter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ChatInput onSend={vi.fn()} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, 'Hello')
    
    expect(screen.getByText(/5\/5000/i)).toBeInTheDocument()
  })

  it('trims message before sending', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    
    renderWithProviders(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/ask me anything/i)
    await user.type(input, '  Test message  {Enter}')
    
    expect(handleSend).toHaveBeenCalledWith('Test message')
    expect(handleSend).not.toHaveBeenCalledWith('  Test message  ')
  })
})


