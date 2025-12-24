/**
 * Gemini Helpers Tests
 * Tests for chatbot helper functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateMessageId,
  formatTimestamp,
  validateMessage,
  truncateHistory,
  sanitizeInput,
  isApiKeyConfigured,
} from '@/lib/gemini/helpers'
import type { ChatMessage } from '@/lib/gemini/types'

describe('gemini helpers', () => {
  describe('generateMessageId', () => {
    it('should generate unique message IDs', () => {
      const id1 = generateMessageId()
      const id2 = generateMessageId()

      expect(id1).toMatch(/^msg_\d+_[a-z0-9]+$/)
      expect(id2).toMatch(/^msg_\d+_[a-z0-9]+$/)
      expect(id1).not.toBe(id2)
    })

    it('should start with msg_ prefix', () => {
      const id = generateMessageId()
      expect(id).toMatch(/^msg_/)
    })
  })

  describe('formatTimestamp', () => {
    it('should format date to time string', () => {
      const date = new Date('2024-01-15T14:30:00Z')
      const formatted = formatTimestamp(date)

      expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i)
    })

    it('should handle different times', () => {
      const morning = new Date('2024-01-15T09:15:00Z')
      const evening = new Date('2024-01-15T21:45:00Z')

      const morningFormatted = formatTimestamp(morning)
      const eveningFormatted = formatTimestamp(evening)

      expect(morningFormatted).toBeTruthy()
      expect(eveningFormatted).toBeTruthy()
    })
  })

  describe('validateMessage', () => {
    it('should validate non-empty message', () => {
      const result = validateMessage('Valid message')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty message', () => {
      const result = validateMessage('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Message cannot be empty')
    })

    it('should reject whitespace-only message', () => {
      const result = validateMessage('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Message cannot be empty')
    })

    it('should reject message exceeding max length', () => {
      const longMessage = 'a'.repeat(5001)
      const result = validateMessage(longMessage)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Message is too long (max 5000 characters)')
    })

    it('should accept message at max length', () => {
      const maxMessage = 'a'.repeat(5000)
      const result = validateMessage(maxMessage)

      expect(result.valid).toBe(true)
    })
  })

  describe('truncateHistory', () => {
    it('should return history as-is if within limit', () => {
      const history: ChatMessage[] = Array.from({ length: 10 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        timestamp: new Date(),
      }))

      const result = truncateHistory(history, 20)
      expect(result).toHaveLength(10)
      expect(result).toEqual(history)
    })

    it('should truncate history exceeding limit', () => {
      const history: ChatMessage[] = Array.from({ length: 30 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        timestamp: new Date(),
      }))

      const result = truncateHistory(history, 20)
      expect(result).toHaveLength(20)
      expect(result).toEqual(history.slice(-20))
    })

    it('should use default maxMessages of 20', () => {
      const history: ChatMessage[] = Array.from({ length: 30 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        timestamp: new Date(),
      }))

      const result = truncateHistory(history)
      expect(result).toHaveLength(20)
    })

    it('should handle empty history', () => {
      const result = truncateHistory([])
      expect(result).toEqual([])
    })
  })

  describe('sanitizeInput', () => {
    it('should trim input', () => {
      const result = sanitizeInput('  test  ')
      expect(result).toBe('test')
    })

    it('should replace multiple newlines with double newline', () => {
      const input = 'Line 1\n\n\nLine 2\n\n\n\nLine 3'
      const result = sanitizeInput(input)
      expect(result).toBe('Line 1\n\nLine 2\n\nLine 3')
    })

    it('should preserve single newlines', () => {
      const input = 'Line 1\nLine 2'
      const result = sanitizeInput(input)
      expect(result).toBe('Line 1\nLine 2')
    })

    it('should preserve double newlines', () => {
      const input = 'Line 1\n\nLine 2'
      const result = sanitizeInput(input)
      expect(result).toBe('Line 1\n\nLine 2')
    })
  })

  describe('isApiKeyConfigured', () => {
    const originalEnv = import.meta.env

    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: originalEnv,
        writable: true,
        configurable: true,
      })
    })

    it('should return true when API URL is configured', () => {
      Object.defineProperty(import.meta, 'env', {
        value: {
          ...originalEnv,
          VITE_API_URL: 'https://api.example.com',
        },
        writable: true,
        configurable: true,
      })

      expect(isApiKeyConfigured()).toBe(true)
    })

    it('should return false when API URL is not configured', () => {
      Object.defineProperty(import.meta, 'env', {
        value: {
          ...originalEnv,
          VITE_API_URL: undefined,
        },
        writable: true,
        configurable: true,
      })

      expect(isApiKeyConfigured()).toBe(false)
    })

    it('should return false when API URL is empty string', () => {
      Object.defineProperty(import.meta, 'env', {
        value: {
          ...originalEnv,
          VITE_API_URL: '',
        },
        writable: true,
        configurable: true,
      })

      expect(isApiKeyConfigured()).toBe(false)
    })

    it('should return false when API URL is only whitespace', () => {
      Object.defineProperty(import.meta, 'env', {
        value: {
          ...originalEnv,
          VITE_API_URL: '   ',
        },
        writable: true,
        configurable: true,
      })

      expect(isApiKeyConfigured()).toBe(false)
    })
  })
})


