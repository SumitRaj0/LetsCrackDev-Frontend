/**
 * Resource Mapper Tests
 * Tests for backend to frontend resource mapping
 */

import { describe, it, expect } from 'vitest'
import { mapBackendResourceToFrontend } from '@/lib/api/resourceMapper'
import type { Resource as BackendResource } from '@/lib/api/resources.api'

describe('resourceMapper', () => {
  describe('mapBackendResourceToFrontend', () => {
    const createMockBackendResource = (
      overrides: Partial<BackendResource> = {}
    ): BackendResource => ({
      _id: 'resource-123',
      title: 'Test Resource',
      description: 'Test Description',
      category: 'Frontend Development',
      tags: ['react', 'typescript'],
      link: 'https://example.com',
      difficulty: 'beginner',
      createdBy: {
        _id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      ...overrides,
    })

    it('should map basic resource fields correctly', () => {
      const backendResource = createMockBackendResource()

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.id).toBe('resource-123')
      expect(result.title).toBe('Test Resource')
      expect(result.description).toBe('Test Description')
      expect(result.url).toBe('https://example.com')
      expect(result.createdAt).toBe('2024-01-15T10:00:00Z')
      expect(result.tags).toEqual(['react', 'typescript'])
    })

    it('should convert category to categorySlug', () => {
      const backendResource = createMockBackendResource({
        category: 'Frontend Development',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.category).toBe('Frontend Development')
      expect(result.categorySlug).toBe('frontend-development')
    })

    it('should handle category with multiple words', () => {
      const backendResource = createMockBackendResource({
        category: 'Backend Development',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.categorySlug).toBe('backend-development')
    })

    it('should map beginner difficulty to rating 4.0', () => {
      const backendResource = createMockBackendResource({
        difficulty: 'beginner',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.rating).toBe(4.0)
    })

    it('should map intermediate difficulty to rating 4.5', () => {
      const backendResource = createMockBackendResource({
        difficulty: 'intermediate',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.rating).toBe(4.5)
    })

    it('should map advanced difficulty to rating 5.0', () => {
      const backendResource = createMockBackendResource({
        difficulty: 'advanced',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.rating).toBe(5.0)
    })

    it('should default to 4.0 rating for unknown difficulty', () => {
      const backendResource = createMockBackendResource({
        difficulty: 'unknown' as any,
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.rating).toBe(4.0)
    })

    it('should set savedCount to 0', () => {
      const backendResource = createMockBackendResource()

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.savedCount).toBe(0)
    })

    it('should handle empty tags array', () => {
      const backendResource = createMockBackendResource({
        tags: [],
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.tags).toEqual([])
    })

    it('should handle category with special characters', () => {
      const backendResource = createMockBackendResource({
        category: 'AI & Machine Learning',
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.categorySlug).toBe('ai-&-machine-learning')
    })

    it('should preserve all tag values', () => {
      const backendResource = createMockBackendResource({
        tags: ['tag1', 'tag2', 'tag3', 'tag4'],
      })

      const result = mapBackendResourceToFrontend(backendResource)

      expect(result.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4'])
      expect(result.tags.length).toBe(4)
    })
  })
})


