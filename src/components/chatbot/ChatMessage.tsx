/**
 * ChatMessage Component
 * Displays individual chat messages (user or AI)
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatTimestamp } from '@/lib/gemini/helpers'
import type { ChatMessage as ChatMessageType } from '@/lib/gemini/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-[80%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
              : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white rounded-bl-sm'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="text-sm leading-relaxed whitespace-pre-wrap break-words space-y-1"
            components={{
              p: ({ node: _node, ...props }) => <p {...props} />,
              li: ({ node: _node, ...props }) => <li className="ml-4 list-disc" {...props} />,
              ul: ({ node: _node, ...props }) => <ul className="mt-1 mb-1 space-y-1" {...props} />,
              // We rely on react-markdown's runtime props here; typing as any is acceptable.
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({ inline, ...props }: any) =>
                inline ? (
                  <code
                    className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs"
                    {...props}
                  />
                ) : (
                  <code
                    className="block p-2 rounded bg-gray-100 dark:bg-gray-900 text-xs overflow-x-auto"
                    {...props}
                  />
                ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
