/**
 * User API Tests
 * Tests for user API service functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as userApi from '@/lib/api/user.api'
import { api } from '@/lib/api/client'

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('user.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user' as const,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await userApi.getProfile()

      expect(api.get).toHaveBeenCalledWith('/v1/user/profile')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '1234567890',
      }

      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            name: 'Updated Name',
            email: 'test@example.com',
            phone: '1234567890',
            role: 'user' as const,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
          },
        },
        message: 'Profile updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      const result = await userApi.updateProfile(updateData)

      expect(api.patch).toHaveBeenCalledWith('/v1/user/profile', updateData)
      expect(result).toEqual(mockResponse)
    })

    it('should update partial profile data', async () => {
      const updateData = {
        name: 'New Name',
      }

      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '123',
            name: 'New Name',
            email: 'test@example.com',
            role: 'user' as const,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
          },
        },
        message: 'Profile updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      await userApi.updateProfile(updateData)

      expect(api.patch).toHaveBeenCalledWith('/v1/user/profile', updateData)
    })
  })

  describe('changePassword', () => {
    it('should change password', async () => {
      const passwordData = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      }

      const mockResponse = {
        success: true,
        data: {
          success: true,
        },
        message: 'Password changed',
      }

      vi.mocked(api.put).mockResolvedValue(mockResponse)

      const result = await userApi.changePassword(passwordData)

      expect(api.put).toHaveBeenCalledWith('/v1/user/change-password', passwordData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      const mockResponse = {
        success: true,
        data: {
          success: true,
        },
        message: 'Account deleted',
      }

      vi.mocked(api.delete).mockResolvedValue(mockResponse)

      const result = await userApi.deleteAccount()

      expect(api.delete).toHaveBeenCalledWith('/v1/user/account')
      expect(result).toEqual(mockResponse)
    })
  })
})


