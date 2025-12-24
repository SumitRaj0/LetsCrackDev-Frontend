/**
 * Keyboard Shortcut Hook
 * Handles keyboard shortcuts like Cmd/Ctrl + K
 */

import { useEffect, useRef } from 'react'

interface UseKeyboardShortcutOptions {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  enabled?: boolean
}

export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  callback,
  enabled = true,
}: UseKeyboardShortcutOptions) {
  // Use ref to avoid re-creating event listener when callback changes
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrlKey &&
        e.metaKey === metaKey &&
        e.shiftKey === shiftKey &&
        e.altKey === altKey
      ) {
        // Don't trigger if user is typing in an input/textarea
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }

        e.preventDefault()
        callbackRef.current()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrlKey, metaKey, shiftKey, altKey, enabled])
}
