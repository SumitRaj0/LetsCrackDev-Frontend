/**
 * Chatbot API Tests
 * Tests for chatbot API service functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as chatbotApi from '@/lib/api/chatbot.api'
import { api } from '@/lib/api/client'

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('chatbot.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sendChatMessage', () => {
    it('should send chat message without history', async () => {
      const messageData = {
        message: 'Hello, AI!',
      }

      const mockResponse = {
        success: true,
        data: {
          reply: 'Hello! How can I help you?',
        },
        message: 'Message sent',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await chatbotApi.sendChatMessage(messageData)

      expect(api.post).toHaveBeenCalledWith('/v1/chatbot/chat', messageData)
      expect(result).toEqual(mockResponse)
    })

    it('should send chat message with history', async () => {
      const messageData = {
        message: 'Tell me about React',
        history: [
          { role: 'user' as const, content: 'Hello' },
          { role: 'assistant' as const, content: 'Hi there!' },
        ],
      }

      const mockResponse = {
        success: true,
        data: {
          reply: 'React is a JavaScript library...',
        },
        message: 'Message sent',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await chatbotApi.sendChatMessage(messageData)

      expect(api.post).toHaveBeenCalledWith('/v1/chatbot/chat', messageData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty history array', async () => {
      const messageData = {
        message: 'Test message',
        history: [],
      }

      const mockResponse = {
        success: true,
        data: {
          reply: 'Response',
        },
        message: 'Message sent',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await chatbotApi.sendChatMessage(messageData)

      expect(api.post).toHaveBeenCalledWith('/v1/chatbot/chat', messageData)
      expect(result).toEqual(mockResponse)
    })
  })
})


