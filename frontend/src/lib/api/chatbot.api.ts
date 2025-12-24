/**
 * Chatbot API Service
 * Handles AI chatbot endpoints
 */

import { api } from './client'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SendChatMessageRequest {
  message: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  success: boolean
  data: {
    reply: string
  }
  message: string
}

/**
 * Send message to AI chatbot
 */
export async function sendChatMessage(data: SendChatMessageRequest): Promise<ChatResponse> {
  return api.post<ChatResponse>('/v1/chatbot/chat', data)
}

