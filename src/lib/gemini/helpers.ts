/**
 * Gemini AI Helper Functions
 * Utility functions for the chatbot
 */

import type { ChatMessage } from './types'

/**
 * Generate a unique ID for a chat message
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Validate message content
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' }
  }

  if (message.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters)' }
  }

  return { valid: true }
}

/**
 * Truncate message history to prevent token limit issues
 */
export function truncateHistory(history: ChatMessage[], maxMessages: number = 20): ChatMessage[] {
  if (history.length <= maxMessages) {
    return history
  }

  // Keep the first system message and the most recent messages
  return history.slice(-maxMessages)
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\n{3,}/g, '\n\n')
}

/**
 * Check if backend API is configured.
 * We now rely on the backend server for chat, so as long as an API base URL exists,
 * the chatbot can attempt requests and handle errors from the backend.
 */
export function isApiKeyConfigured(): boolean {
  const apiUrl = import.meta.env.VITE_API_URL
  return !!apiUrl && apiUrl.trim().length > 0
}
