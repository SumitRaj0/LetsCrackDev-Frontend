import axios, { AxiosError, InternalAxiosRequestConfig, type CancelTokenSource } from 'axios'
import { getStoredAccessToken, getStoredRefreshToken, storeAuthTokens, clearAuthTokens } from '@/utils/authStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://letscrackdev-backend.onrender.com/api'

interface RefreshTokenResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
  }
  message: string
}

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token to requests
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken()

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - handle 401 and token refresh
axiosClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosClient(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getStoredRefreshToken()

      if (!refreshToken) {
        // No refresh token, clear auth and redirect
        clearAuthTokens()
        processQueue(error, null)
        isRefreshing = false
        
        // Redirect to login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
        
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh token (this call doesn't need auth header)
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/v1/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        
        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          
          // Store new tokens
          storeAuthTokens({
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: 15 * 60, // 15 minutes
          })

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          // Process queued requests
          processQueue(null, accessToken)
          isRefreshing = false

          // Retry original request
          return axiosClient(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect
        clearAuthTokens()
        processQueue(error, null)
        isRefreshing = false
        
        // Redirect to login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Request cancellation for logout - track all active requests
let activeCancelTokens: CancelTokenSource[] = []

// Add request interceptor to track cancel tokens (runs after token interceptor)
axiosClient.interceptors.request.use(
  config => {
    // Create cancel token for this request
    const cancelTokenSource = axios.CancelToken.source()
    activeCancelTokens.push(cancelTokenSource)
    
    // Add cancel token to config
    config.cancelToken = cancelTokenSource.token
    
    return config
  },
  error => Promise.reject(error)
)

// Clean up completed requests from response
axiosClient.interceptors.response.use(
  response => {
    // Request completed successfully
    return response
  },
  error => {
    // If error is due to cancellation, it's expected
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

/**
 * Cancel all pending requests (used on logout)
 */
export const cancelAllRequests = () => {
  activeCancelTokens.forEach(cancelToken => {
    try {
      cancelToken.cancel('Request cancelled due to logout')
    } catch (error) {
      // Token may already be cancelled, ignore
    }
  })
  activeCancelTokens = []
}

export default axiosClient


