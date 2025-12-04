/**
 * Global Error Context
 * Provides centralized error state management and error handling utilities
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useErrorLogger } from '@/lib/errors/logger'
import { ApiClientError } from '@/lib/api/client'

interface ErrorContextType {
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void
  clearError: () => void
  currentError: Error | null
}

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  toastMessage?: string
  context?: Record<string, unknown>
  onShowToast?: (message: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({
  children,
  showToastFn,
}: {
  children: ReactNode
  showToastFn?: (message: string) => void
}) {
  const [currentError, setCurrentError] = useState<Error | null>(null)
  const { logError } = useErrorLogger()

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError: shouldLog = true,
        toastMessage,
        context,
        onShowToast,
      } = options

      // Extract error message
      let message = 'An unexpected error occurred'
      let errorObj: Error | null = null

      if (error instanceof ApiClientError) {
        message = error.message
        errorObj = error
      } else if (error instanceof Error) {
        message = error.message
        errorObj = error
      } else if (typeof error === 'string') {
        message = error
      } else {
        message = String(error)
      }

      // Log error
      if (shouldLog) {
        logError(error, context)
      }

      // Show toast notification (use provided function or context function)
      if (showToast) {
        const toastFn = onShowToast || showToastFn
        if (toastFn) {
          toastFn(toastMessage || message)
        }
      }

      // Store error state
      setCurrentError(errorObj || new Error(message))
    },
    [showToastFn, logError]
  )

  const clearError = useCallback(() => {
    setCurrentError(null)
  }, [])

  return (
    <ErrorContext.Provider value={{ handleError, clearError, currentError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useErrorHandler() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useErrorHandler must be used within an ErrorProvider')
  }
  return context
}
