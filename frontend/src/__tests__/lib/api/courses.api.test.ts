/**
 * Courses API Tests
 * Tests for course API service functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as coursesApi from '@/lib/api/courses.api'
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

describe('courses.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCourses', () => {
    it('should fetch courses with no params', async () => {
      const mockResponse = {
        success: true,
        data: { courses: [], pagination: {} },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await coursesApi.getCourses()

      expect(api.get).toHaveBeenCalledWith('/v1/courses')
      expect(result).toEqual(mockResponse)
    })

    it('should fetch courses with filters', async () => {
      const mockResponse = {
        success: true,
        data: { courses: [], pagination: {} },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      await coursesApi.getCourses({
        category: 'web-development',
        difficulty: 'intermediate',
        isPremium: true,
        minPrice: 10,
        maxPrice: 100,
        search: 'react',
      })

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('category=web-development')
      )
    })
  })

  describe('getCourseById', () => {
    it('should fetch course by ID', async () => {
      const mockResponse = {
        success: true,
        data: { course: { _id: '123', title: 'Test Course' } },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await coursesApi.getCourseById('123')

      expect(api.get).toHaveBeenCalledWith('/v1/courses/123')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('enrollInCourse', () => {
    it('should enroll in course', async () => {
      const mockResponse = {
        success: true,
        data: {
          enrollment: {
            courseId: '123',
            progress: 0,
            enrolledAt: '2024-01-01T00:00:00Z',
          },
        },
        message: 'Enrolled',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await coursesApi.enrollInCourse('123')

      expect(api.post).toHaveBeenCalledWith('/v1/courses/123/enroll')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCourseEnrollment', () => {
    it('should fetch course enrollment', async () => {
      const mockResponse = {
        success: true,
        data: {
          enrollment: {
            courseId: '123',
            progress: 50,
            completedLessons: ['lesson1'],
            enrolledAt: '2024-01-01T00:00:00Z',
          },
          isEnrolled: true,
        },
        message: 'Success',
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await coursesApi.getCourseEnrollment('123')

      expect(api.get).toHaveBeenCalledWith('/v1/courses/123/enrollment')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateCourseProgress', () => {
    it('should update course progress', async () => {
      const progressData = {
        progress: 75,
        completedLessons: ['lesson1', 'lesson2'],
      }

      const mockResponse = {
        success: true,
        data: {
          enrollment: {
            courseId: '123',
            progress: 75,
            completedLessons: ['lesson1', 'lesson2'],
            enrolledAt: '2024-01-01T00:00:00Z',
          },
        },
        message: 'Updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      const result = await coursesApi.updateCourseProgress('123', progressData)

      expect(api.patch).toHaveBeenCalledWith('/v1/courses/123/progress', progressData)
      expect(result).toEqual(mockResponse)
    })

    it('should update only progress', async () => {
      const progressData = { progress: 50 }

      const mockResponse = {
        success: true,
        data: {
          enrollment: {
            courseId: '123',
            progress: 50,
            completedLessons: [],
            enrolledAt: '2024-01-01T00:00:00Z',
          },
        },
        message: 'Updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      await coursesApi.updateCourseProgress('123', progressData)

      expect(api.patch).toHaveBeenCalledWith('/v1/courses/123/progress', progressData)
    })
  })

  describe('createCourse', () => {
    it('should create course with data', async () => {
      const courseData = {
        title: 'New Course',
        description: 'Description',
        category: 'web-development',
        price: 99,
      }

      const mockResponse = {
        success: true,
        data: { course: { _id: '123', ...courseData } },
        message: 'Created',
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await coursesApi.createCourse(courseData)

      expect(api.post).toHaveBeenCalledWith('/v1/courses', courseData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateCourse', () => {
    it('should update course with data', async () => {
      const updateData = { title: 'Updated Course' }
      const mockResponse = {
        success: true,
        data: { course: { _id: '123', title: 'Updated Course' } },
        message: 'Updated',
      }

      vi.mocked(api.patch).mockResolvedValue(mockResponse)

      const result = await coursesApi.updateCourse('123', updateData)

      expect(api.patch).toHaveBeenCalledWith('/v1/courses/123', updateData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteCourse', () => {
    it('should delete course by ID', async () => {
      const mockResponse = {
        success: true,
        message: 'Deleted',
      }

      vi.mocked(api.delete).mockResolvedValue(mockResponse)

      const result = await coursesApi.deleteCourse('123')

      expect(api.delete).toHaveBeenCalledWith('/v1/courses/123')
      expect(result).toEqual(mockResponse)
    })
  })
})


