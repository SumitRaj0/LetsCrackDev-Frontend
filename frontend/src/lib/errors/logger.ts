/**
 * Error Logging Utility
 * Centralized error logging with support for external services (Sentry, etc.)
 */

export interface ErrorLog {
  message: string
  error?: Error | unknown
  context?: Record<string, unknown>
  level?: 'error' | 'warning' | 'info'
  timestamp: Date
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100 // Keep last 100 logs in memory

  /**
   * Log an error
   */
  log(error: Partial<ErrorLog> & { message: string }): void {
    const logEntry: ErrorLog = {
      ...error,
      timestamp: error.timestamp || new Date(),
      level: error.level || 'error',
    }

    // Add to in-memory logs
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console logging (always in development)
    if (import.meta.env.DEV) {
      const { message, error: err, context, level } = logEntry
      const logLevel = level || 'error'
      const logMethod =
        logLevel === 'error' ? console.error : logLevel === 'warning' ? console.warn : console.info

      logMethod(`[${logLevel.toUpperCase()}] ${message}`, {
        error: err,
        context,
        timestamp: logEntry.timestamp,
      })
    }

    // TODO: Integrate with external error tracking service (e.g., Sentry)
    // Example:
    // if (import.meta.env.PROD && window.Sentry) {
    //   window.Sentry.captureException(err, { extra: context })
    // }
  }

  /**
   * Log an error with automatic message extraction
   */
  logError(error: unknown, context?: Record<string, unknown>): void {
    const message = error instanceof Error ? error.message : String(error)
    this.log({
      message,
      error,
      context,
      level: 'error',
      timestamp: new Date(),
    })
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(count = 10): ErrorLog[] {
    return this.logs.slice(-count)
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = []
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger()

/**
 * React hook for error logging
 */
export function useErrorLogger() {
  return {
    logError: (error: unknown, context?: Record<string, unknown>) => {
      errorLogger.logError(error, context)
    },
    logWarning: (message: string, context?: Record<string, unknown>) => {
      errorLogger.log({ message, context, level: 'warning', timestamp: new Date() })
    },
    logInfo: (message: string, context?: Record<string, unknown>) => {
      errorLogger.log({ message, context, level: 'info', timestamp: new Date() })
    },
  }
}
