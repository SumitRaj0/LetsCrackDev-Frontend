/**
 * ChatInput Component
 * Input field and send button for chat messages
 */

import { useState } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask me anything about coding...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full h-11 px-4 pr-12 rounded-xl border border-indigo-300/70 dark:border-indigo-700/70 
                     bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Character counter */}
          <div className="absolute right-10 bottom-1 text-[11px] text-gray-400">
            {message.length}/5000
          </div>

          {/* Static AI icon on the right, like Cursor */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md pointer-events-none">
            {/* Google-style sparkle AI icon (similar to Gemini) */}
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L15.09 8.26L24 10L15.09 11.74L12 20L8.91 11.74L0 10L8.91 8.26L12 0Z" />
              <path d="M12 4L10.5 7.5L7 9L10.5 10.5L12 14L13.5 10.5L17 9L13.5 7.5L12 4Z" fill="white" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
