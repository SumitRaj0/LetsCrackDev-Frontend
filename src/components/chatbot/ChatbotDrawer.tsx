/**
 * Chatbot Drawer Component
 * Right-side panel that pushes content (like Cursor editor)
 * Resizable width with drag handle
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { Chatbot } from './Chatbot'
import { useChatbot } from '@/contexts/ChatbotContext'

interface ChatbotDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotDrawer({ isOpen, onClose }: ChatbotDrawerProps) {
  const { width, setWidth } = useChatbot()
  const [isResizing, setIsResizing] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle mouse move for resizing
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      setWidth(newWidth)
    },
    [isResizing, setWidth]
  )

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (isResizing) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-screen bg-app-gradient dark:bg-gray-900 border-l border-gray-200/50 dark:border-gray-700/50 z-40 transform ${
        isResizing ? 'transition-none' : 'transition-transform duration-300 ease-out'
      } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      {isOpen && (
        <div
          className="absolute left-0 top-0 h-full w-2 bg-transparent hover:bg-indigo-500/30 dark:hover:bg-indigo-400/30 cursor-col-resize transition-colors group z-10"
          onMouseDown={e => {
            e.preventDefault()
            setIsResizing(true)
          }}
          title="Drag to resize"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-20 bg-indigo-500 dark:bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="h-full flex flex-col">
        <Chatbot onClose={onClose} className="h-full rounded-none border-0 shadow-none" />
      </div>
    </div>
  )
}
