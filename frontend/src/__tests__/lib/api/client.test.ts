/**
 * API Client Tests
 * Tests for the centralized API client with error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiClient, api, setAuthTokenGetter, ApiClientError } from '@/lib/api/client'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
    // Reset token getter
    setAuthTokenGetter(async () => null)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('apiClient', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, name: 'Test' },
        message: 'Success',
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      })

      const result = await apiClient('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should include Authorization header when token getter is set', async () => {
      const mockToken = 'test-token-123'
      setAuthTokenGetter(async () => mockToken)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })

      await apiClient('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      )
    })

    it('should handle POST request with body', async () => {
      const requestData = { name: 'Test', email: 'test@example.com' }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: requestData }),
      })

      await apiClient('/test', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      )
    })

    it('should handle 401 unauthorized error', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Authentication required',
        }),
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      await expect(apiClient('/test')).rejects.toThrow('Authentication required')
    })

    it('should handle 404 not found error', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Resource not found',
        }),
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      await expect(apiClient('/test')).rejects.toThrow('Resource not found')
    })

    it('should handle 429 rate limit error', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Rate limit exceeded',
        }),
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient('/test')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).status).toBe(429)
        expect((error as ApiClientError).message).toBe('Rate limit exceeded')
      }
    })

    it('should handle 500 server error', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Server error occurred',
        }),
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient('/test')
      } catch (error) {
        expect((error as ApiClientError).status).toBe(500)
        expect((error as ApiClientError).message).toBe('Server error occurred')
      }
    })

    it('should handle network errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient('/test')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).code).toBe('NETWORK_ERROR')
      }
    })

    it('should handle timeout', async () => {
      ;(global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true }),
              })
            }, 35000) // Longer than default timeout
          })
      )

      const promise = apiClient('/test', { timeout: 1000 })
      
      // Fast-forward time
      vi.advanceTimersByTime(1000)

      await expect(promise).rejects.toThrow(ApiClientError)
      
      try {
        await promise
      } catch (error) {
        expect((error as ApiClientError).code).toBe('TIMEOUT')
      }
    })

    it('should handle non-JSON responses', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'Plain text response',
      })

      const result = await apiClient('/test')
      expect(result).toBe('Plain text response')
    })

    it('should use custom timeout', async () => {
      ;(global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true }),
              })
            }, 5000)
          })
      )

      const promise = apiClient('/test', { timeout: 2000 })
      vi.advanceTimersByTime(2000)

      await expect(promise).rejects.toThrow()
    })

    it('should handle absolute URLs', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })

      await apiClient('https://external-api.com/endpoint')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://external-api.com/endpoint',
        expect.any(Object)
      )
    })

    it('should use skipErrorHandling option', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Validation error',
        }),
      })

      await expect(apiClient('/test', { skipErrorHandling: true })).rejects.toThrow(ApiClientError)
    })

    it('should handle error response without JSON', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'text/plain' }),
        json: async () => {
          throw new Error('Not JSON')
        },
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient('/test')
      } catch (error) {
        expect((error as ApiClientError).message).toBe('Internal Server Error')
      }
    })

    it('should handle error response with error field', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          error: 'Custom error message',
        }),
      })

      await expect(apiClient('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient('/test')
      } catch (error) {
        expect((error as ApiClientError).message).toBe('Custom error message')
      }
    })
  })

  describe('api convenience methods', () => {
    beforeEach(() => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })
    })

    it('should make GET request via api.get', async () => {
      await api.get('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('should make POST request via api.post', async () => {
      const data = { name: 'Test' }
      await api.post('/test', data)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        })
      )
    })

    it('should make PUT request via api.put', async () => {
      const data = { name: 'Updated' }
      await api.put('/test', data)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data),
        })
      )
    })

    it('should make PATCH request via api.patch', async () => {
      const data = { name: 'Patched' }
      await api.patch('/test', data)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      )
    })

    it('should make DELETE request via api.delete', async () => {
      await api.delete('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('setAuthTokenGetter', () => {
    it('should set token getter function', async () => {
      const mockToken = 'test-token'
      const getter = vi.fn().mockResolvedValue(mockToken)

      setAuthTokenGetter(getter)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })

      await apiClient('/test')

      expect(getter).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      )
    })

    it('should handle token getter returning null', async () => {
      setAuthTokenGetter(async () => null)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })

      await apiClient('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      )
    })

    it('should handle token getter throwing error', async () => {
      const getter = vi.fn().mockRejectedValue(new Error('Token error'))
      setAuthTokenGetter(getter)

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      })

      // Should still make request without token
      await apiClient('/test')
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})


