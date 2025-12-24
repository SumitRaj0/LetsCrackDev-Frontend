/**
 * Courses API Service
 * Handles course endpoints
 */

import { api } from './client'

export interface Lesson {
  title: string
  description?: string
  videoUrl: string
  freePreview: boolean
  duration?: number
  order: number
}

export interface Course {
  _id: string
  title: string
  description: string
  thumbnail?: string
  lessons?: Lesson[]
  price: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  createdBy: {
    _id: string
    name: string
    email: string
  }
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCourseData {
  title: string
  description: string
  thumbnail?: string
  lessons?: Lesson[]
  price: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category: string
  isPremium?: boolean
}

export interface UpdateCourseData {
  title?: string
  description?: string
  thumbnail?: string
  lessons?: Lesson[]
  price?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  isPremium?: boolean
}

export interface GetCoursesParams {
  page?: number
  limit?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isPremium?: boolean
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface CoursesListResponse {
  success: boolean
  data: {
    courses: Course[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
  message: string
}

export interface CourseResponse {
  success: boolean
  data: {
    course: Course
  }
  message: string
}

export interface CreateCourseResponse {
  success: boolean
  data: {
    course: Course
  }
  message: string
}

/**
 * Get all courses with optional filters
 */
export async function getCourses(params?: GetCoursesParams): Promise<CoursesListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
  if (params?.isPremium !== undefined) queryParams.append('isPremium', params.isPremium.toString())
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())
  if (params?.search) queryParams.append('search', params.search)

  const queryString = queryParams.toString()
  const endpoint = `/v1/courses${queryString ? `?${queryString}` : ''}`
  
  return api.get<CoursesListResponse>(endpoint)
}

/**
 * Get course by ID
 */
export async function getCourseById(id: string): Promise<CourseResponse> {
  return api.get<CourseResponse>(`/v1/courses/${id}`)
}

/**
 * Create course (Admin only)
 */
export async function createCourse(data: CreateCourseData): Promise<CreateCourseResponse> {
  return api.post<CreateCourseResponse>('/v1/courses', data)
}

/**
 * Update course (Admin only)
 */
export async function updateCourse(id: string, data: UpdateCourseData): Promise<CourseResponse> {
  return api.patch<CourseResponse>(`/v1/courses/${id}`, data)
}

/**
 * Delete course (Admin only)
 */
export async function deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(`/v1/courses/${id}`)
}

/**
 * Enroll in a course (Authenticated)
 */
export async function enrollInCourse(id: string): Promise<{
  success: boolean
  data: {
    enrollment: {
      courseId: string
      progress: number
      enrolledAt: string
    }
  }
  message: string
}> {
  return api.post<{
    success: boolean
    data: {
      enrollment: {
        courseId: string
        progress: number
        enrolledAt: string
      }
    }
    message: string
  }>(`/v1/courses/${id}/enroll`)
}

/**
 * Get user enrollment for a course (Authenticated)
 */
export async function getCourseEnrollment(id: string): Promise<{
  success: boolean
  data: {
    enrollment: {
      courseId: string
      progress: number
      completedLessons: string[]
      enrolledAt: string
    } | null
    isEnrolled: boolean
  }
  message: string
}> {
  return api.get<{
    success: boolean
    data: {
      enrollment: {
        courseId: string
        progress: number
        completedLessons: string[]
        enrolledAt: string
      } | null
      isEnrolled: boolean
    }
    message: string
  }>(`/v1/courses/${id}/enrollment`)
}

/**
 * Update course progress (Authenticated)
 */
export async function updateCourseProgress(
  id: string,
  data: { progress?: number; completedLessons?: string[] }
): Promise<{
  success: boolean
  data: {
    enrollment: {
      courseId: string
      progress: number
      completedLessons: string[]
      enrolledAt: string
    }
  }
  message: string
}> {
  return api.patch<{
    success: boolean
    data: {
      enrollment: {
        courseId: string
        progress: number
        completedLessons: string[]
        enrolledAt: string
      }
    }
    message: string
  }>(`/v1/courses/${id}/progress`, data)
}

