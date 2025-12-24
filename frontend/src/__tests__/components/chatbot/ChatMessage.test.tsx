/**
 * ChatMessage Component Tests
 * Tests for chat message component rendering
 */

import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import { ChatMessage } from '@/components/chatbot/ChatMessage'
import type { ChatMessage as ChatMessageType } from '@/lib/gemini/types'

describe('ChatMessage', () => {
  it('renders user message', () => {
    const message: ChatMessageType = {
      id: '1',
      role: 'user',
      content: 'Hello, AI!',
      timestamp: new Date(),
    }

    renderWithProviders(<ChatMessage message={message} />)

    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('renders assistant message', () => {
    const message: ChatMessageType = {
      id: '2',
      role: 'assistant',
      content: 'Hello! How can I help you?',
      timestamp: new Date(),
    }

    renderWithProviders(<ChatMessage message={message} />)

    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
  })

  it('renders markdown content', () => {
    const message: ChatMessageType = {
      id: '3',
      role: 'assistant',
      content: '# Heading\n\nThis is **bold** text.',
      timestamp: new Date(),
    }

    renderWithProviders(<ChatMessage message={message} />)

    // ReactMarkdown will render the markdown, so we check for the content
    expect(screen.getByText(/heading/i)).toBeInTheDocument()
    expect(screen.getByText(/bold/i)).toBeInTheDocument()
  })

  it('renders code blocks', () => {
    const message: ChatMessageType = {
      id: '4',
      role: 'assistant',
      content: 'Here is code:\n```\nconst x = 1;\n```',
      timestamp: new Date(),
    }

    renderWithProviders(<ChatMessage message={message} />)

    expect(screen.getByText(/here is code/i)).toBeInTheDocument()
  })

  it('displays timestamp', () => {
    const date = new Date('2024-01-15T14:30:00Z')
    const message: ChatMessageType = {
      id: '5',
      role: 'user',
      content: 'Test message',
      timestamp: date,
    }

    renderWithProviders(<ChatMessage message={message} />)

    // Timestamp should be formatted and displayed
    const timestampElement = document.querySelector('.text-xs.text-gray-500')
    expect(timestampElement).toBeInTheDocument()
  })

  it('applies user message styling', () => {
    const message: ChatMessageType = {
      id: '6',
      role: 'user',
      content: 'User message',
      timestamp: new Date(),
    }

    const { container } = renderWithProviders(<ChatMessage message={message} />)

    // User messages should have gradient background
    const messageBubble = container.querySelector('.bg-gradient-to-r')
    expect(messageBubble).toBeInTheDocument()
  })

  it('applies assistant message styling', () => {
    const message: ChatMessageType = {
      id: '7',
      role: 'assistant',
      content: 'Assistant message',
      timestamp: new Date(),
    }

    const { container } = renderWithProviders(<ChatMessage message={message} />)

    // Assistant messages should have white/gray background
    const messageBubble = container.querySelector('.bg-white')
    expect(messageBubble).toBeInTheDocument()
  })

  it('aligns user messages to the right', () => {
    const message: ChatMessageType = {
      id: '8',
      role: 'user',
      content: 'User message',
      timestamp: new Date(),
    }

    const { container } = renderWithProviders(<ChatMessage message={message} />)

    const messageContainer = container.firstChild as HTMLElement
    expect(messageContainer).toHaveClass('justify-end')
  })

  it('aligns assistant messages to the left', () => {
    const message: ChatMessageType = {
      id: '9',
      role: 'assistant',
      content: 'Assistant message',
      timestamp: new Date(),
    }

    const { container } = renderWithProviders(<ChatMessage message={message} />)

    const messageContainer = container.firstChild as HTMLElement
    expect(messageContainer).toHaveClass('justify-start')
  })
})


