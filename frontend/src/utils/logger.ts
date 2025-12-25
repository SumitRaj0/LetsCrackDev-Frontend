/**
 * Production-safe logging utility
 * Only logs in development mode to avoid exposing sensitive information
 */

const isDev = import.meta.env.DEV
const isProduction = import.meta.env.PROD

/**
 * Log information (only in development)
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },

  error: (...args: any[]) => {
    // Always log errors, but in production we should send to error service
    console.error(...args)
    
    // TODO: In production, send to error reporting service (Sentry, LogRocket, etc.)
    if (isProduction) {
      // Example: Send to error service
      // errorService.captureException(args[0])
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
}

