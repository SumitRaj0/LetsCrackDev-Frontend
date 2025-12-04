/**
 * Centralized API Client with Error Handling
 * Provides a consistent interface for all API calls with automatic error handling
 * 
 * Note: For authenticated requests, use setAuthTokenGetter() to provide token retrieval function
 */

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

export interface ApiRequestOptions extends RequestInit {
  skipErrorHandling?: boolean
  timeout?: number
}

export class ApiClientError extends Error {
  status?: number
  code?: string
  details?: unknown

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const DEFAULT_TIMEOUT = 30000 // 30 seconds

// Token getter function - will be set by auth service
let tokenGetter: (() => Promise<string | null>) | null = null

/**
 * Set the token getter function for authenticated requests
 */
export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return {
        message: data.error || data.message || 'An error occurred',
        status: response.status,
        code: data.code,
        details: data,
      }
    }
    return {
      message: response.statusText || 'An error occurred',
      status: response.status,
    }
  } catch {
    return {
      message: response.statusText || 'An error occurred',
      status: response.status,
    }
  }
}

/**
 * Create timeout promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiClientError('Request timeout', 408, 'TIMEOUT'))
    }, timeout)
  })
}

/**
 * Centralized API client
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    skipErrorHandling = false,
    timeout = DEFAULT_TIMEOUT,
    headers = {},
    ...fetchOptions
  } = options

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  console.log('[API Client] Making request:', {
    method: fetchOptions.method || 'GET',
    url,
    endpoint,
    baseUrl: API_BASE_URL,
  })

  // Get auth token if available
  let authToken: string | null = null
  if (tokenGetter) {
    try {
      authToken = await tokenGetter()
      if (!authToken) {
        console.warn('[API Client] No token available for request to:', endpoint)
      } else {
        console.log('[API Client] Token retrieved, making request to:', endpoint)
      }
    } catch (error) {
      console.warn('[API Client] Failed to get auth token:', error)
    }
  } else {
    console.warn('[API Client] No token getter registered')
  }

  // Merge headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...headers,
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Race between fetch and timeout
    const fetchPromise = fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      signal: controller.signal,
    })

    const response = await Promise.race([fetchPromise, createTimeoutPromise(timeout)])

    clearTimeout(timeoutId)

    // Handle non-OK responses
    if (!response.ok) {
      const error = await parseErrorResponse(response)

      // Don't throw if error handling is skipped (caller will handle)
      if (skipErrorHandling) {
        throw new ApiClientError(error.message, error.status, error.code, error.details)
      }

      // Map status codes to user-friendly messages
      let userMessage = error.message
      if (error.status === 401) {
        userMessage = 'Authentication required. Please log in.'
      } else if (error.status === 403) {
        userMessage = 'You do not have permission to perform this action.'
      } else if (error.status === 404) {
        userMessage = 'The requested resource was not found.'
      } else if (error.status === 429) {
        userMessage = 'Too many requests. Please try again later.'
      } else if (error.status === 500) {
        userMessage = 'Server error. Please try again later.'
      } else if (error.status === 503) {
        userMessage = 'Service temporarily unavailable. Please try again later.'
      }

      throw new ApiClientError(userMessage, error.status, error.code, error.details)
    }

    // Parse JSON response
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      console.log('[API Client] Response data:', data)

      // Handle API response format with error field
      if (data.error) {
        throw new ApiClientError(data.error, response.status, data.code, data)
      }

      // Backend returns { success: true, data: {...} } format
      // Return the full response object so caller can access both success and data
      return data as T
    }

    // Return text response if not JSON
    return (await response.text()) as unknown as T
  } catch (error) {
    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiClientError('Request timeout. Please try again.', 408, 'TIMEOUT')
    }

    // Re-throw ApiClientError as-is
    if (error instanceof ApiClientError) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiClientError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
    }

    // Handle unknown errors
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    throw new ApiClientError(message, 0, 'UNKNOWN_ERROR', error)
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
}
