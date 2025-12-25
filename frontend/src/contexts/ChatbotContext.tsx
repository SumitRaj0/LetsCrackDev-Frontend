/**
 * Chatbot Context
 * Global state for chatbot drawer - accessible from anywhere in the app
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { logger } from '@/utils/logger'

interface ChatbotContextType {
  isOpen: boolean
  width: number
  openChatbot: () => void
  closeChatbot: () => void
  toggleChatbot: () => void
  setWidth: (width: number) => void
}

const DEFAULT_WIDTH = 600
const MIN_WIDTH = 400
const MAX_WIDTH = 1200

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [width, setWidthState] = useState(() => {
    try {
      const saved = localStorage.getItem('chatbot-width')
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
          return parsed
        }
      }
    } catch (error) {
      logger.error('Error reading chatbot width from localStorage:', error)
    }
    return DEFAULT_WIDTH
  })

  // Save width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chatbot-width', width.toString())
    } catch (error) {
      logger.error('Error saving chatbot width to localStorage:', error)
    }
  }, [width])

  const setWidth = useCallback((newWidth: number) => {
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
    setWidthState(clampedWidth)
  }, [])

  const openChatbot = () => setIsOpen(true)
  const closeChatbot = () => setIsOpen(false)
  const toggleChatbot = () => setIsOpen(prev => !prev)

  return (
    <ChatbotContext.Provider
      value={{ isOpen, width, openChatbot, closeChatbot, toggleChatbot, setWidth }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
