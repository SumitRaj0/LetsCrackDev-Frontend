/**
 * Gemini AI Chatbot Types
 * Type definitions for the LetsCrackDev AI Chatbot
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  reply: string
  error?: string
}

export interface GeminiConfig {
  apiKey: string
  model: string
  temperature?: number
  maxTokens?: number
}

export interface ChatError {
  message: string
  code: 'MISSING_API_KEY' | 'API_ERROR' | 'RATE_LIMIT' | 'NETWORK_ERROR' | 'UNKNOWN'
}
