/**
 * Resources API Service
 * Handles learning resources endpoints
 */

import { api } from './client'

export interface Resource {
  _id: string
  title: string
  description: string
  category: string
  tags: string[]
  link: string
  thumbnail?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateResourceData {
  title: string
  description: string
  category: string
  tags?: string[]
  link: string
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface UpdateResourceData {
  title?: string
  description?: string
  category?: string
  tags?: string[]
  link?: string
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface GetResourcesParams {
  page?: number
  limit?: number
  category?: string
  tags?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  search?: string
}

export interface ResourcesListResponse {
  success: boolean
  data: {
    resources: Resource[]
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

export interface ResourceResponse {
  success: boolean
  data: {
    resource: Resource
  }
  message: string
}

export interface CreateResourceResponse {
  success: boolean
  data: {
    resource: Resource
  }
  message: string
}

/**
 * Get all resources with optional filters
 */
export async function getResources(params?: GetResourcesParams): Promise<ResourcesListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.tags) queryParams.append('tags', params.tags)
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
  if (params?.search) queryParams.append('search', params.search)

  const queryString = queryParams.toString()
  const endpoint = `/v1/resources${queryString ? `?${queryString}` : ''}`
  
  return api.get<ResourcesListResponse>(endpoint)
}

/**
 * Get resource by ID
 */
export async function getResourceById(id: string): Promise<ResourceResponse> {
  return api.get<ResourceResponse>(`/v1/resources/${id}`)
}

/**
 * Create resource (Admin only)
 */
export async function createResource(data: CreateResourceData): Promise<CreateResourceResponse> {
  return api.post<CreateResourceResponse>('/v1/resources', data)
}

/**
 * Update resource (Admin only)
 */
export async function updateResource(id: string, data: UpdateResourceData): Promise<ResourceResponse> {
  return api.patch<ResourceResponse>(`/v1/resources/${id}`, data)
}

/**
 * Delete resource (Admin only)
 */
export async function deleteResource(id: string): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(`/v1/resources/${id}`)
}

/**
 * Toggle bookmark for a resource (Authenticated)
 */
export async function toggleResourceBookmark(id: string): Promise<{
  success: boolean
  data: { bookmarked: boolean }
  message: string
}> {
  return api.post<{
    success: boolean
    data: { bookmarked: boolean }
    message: string
  }>(`/v1/resources/${id}/bookmark`)
}

/**
 * Get all bookmarked resources (Authenticated)
 */
export async function getBookmarkedResources(): Promise<{
  success: boolean
  data: {
    resources: Resource[]
    count: number
  }
  message: string
}> {
  return api.get<{
    success: boolean
    data: {
      resources: Resource[]
      count: number
    }
    message: string
  }>('/v1/resources/bookmarks/all')
}

