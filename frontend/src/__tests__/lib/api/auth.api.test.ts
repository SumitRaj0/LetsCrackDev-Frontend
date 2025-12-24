/**
 * Auth API Tests
 * Tests for authentication API service functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as authApi from '@/lib/api/auth.api'
import axiosClient from '@/lib/api/axiosClient'

// Mock axiosClient
vi.mock('@/lib/api/axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('auth.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      const mockResponse = {
        success: true,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
        message: 'Token refreshed',
      }

      vi.mocked(axiosClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authApi.refreshAccessToken('old-refresh-token')

      expect(axiosClient.post).toHaveBeenCalledWith('/v1/auth/refresh-token', {
        refreshToken: 'old-refresh-token',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getMe', () => {
    it('should get current user', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user' as const,
            createdAt: '2024-01-01',
          },
        },
        message: 'Success',
      }

      vi.mocked(axiosClient.get).mockResolvedValue({ data: mockResponse })

      const result = await authApi.getMe()

      expect(axiosClient.get).toHaveBeenCalledWith('/v1/auth/me')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('forgotPassword', () => {
    it('should request password reset', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset email sent',
      }

      vi.mocked(axiosClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authApi.forgotPassword('test@example.com')

      expect(axiosClient.post).toHaveBeenCalledWith('/v1/auth/forgot-password', {
        email: 'test@example.com',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset successfully',
      }

      vi.mocked(axiosClient.post).mockResolvedValue({ data: mockResponse })

      const result = await authApi.resetPassword('reset-token-123', 'newPassword123')

      expect(axiosClient.post).toHaveBeenCalledWith('/v1/auth/reset-password', {
        token: 'reset-token-123',
        password: 'newPassword123',
      })
      expect(result).toEqual(mockResponse)
    })
  })
})


