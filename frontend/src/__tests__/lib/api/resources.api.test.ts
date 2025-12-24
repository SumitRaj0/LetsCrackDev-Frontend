/**
 * Resources API Tests
 * Tests for resource API service functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as resourcesApi from '@/lib/api/resources.api'
import { api } from '@/lib/api/client'

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('resources.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getResources', () => {
    it('should fetch resources with no params', async () => {
      const mockResponse = {
        success: true,
        data: { resources: [], pagination: {} },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await resourcesApi.getResources()

      expect(api.get).toHaveBeenCalledWith('/v1/resources')
      expect(result).toEqual(mockResponse)
    })

    it('should fetch resources with pagination params', async () => {
      const mockResponse = {
        success: true,
        data: { resources: [], pagination: {} },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      await resourcesApi.getResources({ page: 2, limit: 20 })

      expect(api.get).toHaveBeenCalledWith('/v1/resources?page=2&limit=20')
    })

    it('should fetch resources with filters', async () => {
      const mockResponse = {
        success: true,
        data: { resources: [], pagination: {} },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      await resourcesApi.getResources({
        category: 'frontend',
        difficulty: 'beginner',
        search: 'react',
        tags: 'javascript,typescript',
      })

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('category=frontend')
      )
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('difficulty=beginner')
      )
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('search=react')
      )
    })
  })

  describe('getResourceById', () => {
    it('should fetch resource by ID', async () => {
      const mockResponse = {
        success: true,
        data: { resource: { _id: '123', title: 'Test' } },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await resourcesApi.getResourceById('123')

      expect(api.get).toHaveBeenCalledWith('/v1/resources/123')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createResource', () => {
    it('should create resource with data', async () => {
      const resourceData = {
        title: 'New Resource',
        description: 'Description',
        category: 'frontend',
        link: 'https://example.com',
      }

      const mockResponse = {
        success: true,
        data: { resource: { _id: '123', ...resourceData } },
        message: 'Created',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await resourcesApi.createResource(resourceData)

      expect(api.post).toHaveBeenCalledWith('/v1/resources', resourceData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateResource', () => {
    it('should update resource with data', async () => {
      const updateData = { title: 'Updated Title' }
      const mockResponse = {
        success: true,
        data: { resource: { _id: '123', title: 'Updated Title' } },
        message: 'Updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      const result = await resourcesApi.updateResource('123', updateData)

      expect(api.patch).toHaveBeenCalledWith('/v1/resources/123', updateData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteResource', () => {
    it('should delete resource by ID', async () => {
      const mockResponse = {
        success: true,
        message: 'Deleted',
      }

      vi.mocked(api.delete).mockResolvedValue(mockResponse)

      const result = await resourcesApi.deleteResource('123')

      expect(api.delete).toHaveBeenCalledWith('/v1/resources/123')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('toggleResourceBookmark', () => {
    it('should toggle bookmark for resource', async () => {
      const mockResponse = {
        success: true,
        data: { bookmarked: true },
        message: 'Bookmarked',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await resourcesApi.toggleResourceBookmark('123')

      expect(api.post).toHaveBeenCalledWith('/v1/resources/123/bookmark')
      expect(result).toEqual(mockResponse)
      expect(result.data.bookmarked).toBe(true)
    })
  })

  describe('getBookmarkedResources', () => {
    it('should fetch bookmarked resources', async () => {
      const mockResponse = {
        success: true,
        data: {
          resources: [{ _id: '123', title: 'Bookmarked Resource' }],
          count: 1,
        },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await resourcesApi.getBookmarkedResources()

      expect(api.get).toHaveBeenCalledWith('/v1/resources/bookmarks/all')
      expect(result).toEqual(mockResponse)
    })
  })
})


