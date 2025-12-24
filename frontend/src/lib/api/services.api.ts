/**
 * Services API Service
 * Handles premium services endpoints
 */

import { api } from './client'

export interface Service {
  _id: string
  name: string
  description: string
  price: number
  category: 'resume' | 'interview' | 'mentorship' | 'portfolio' | 'crash-course'
  slug: string
  deliverables: string[]
  availability: boolean
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateServiceData {
  name: string
  description: string
  price: number
  category: 'resume' | 'interview' | 'mentorship' | 'portfolio' | 'crash-course'
  slug: string
  deliverables?: string[]
  availability?: boolean
}

export interface UpdateServiceData {
  name?: string
  description?: string
  price?: number
  category?: 'resume' | 'interview' | 'mentorship' | 'portfolio' | 'crash-course'
  slug?: string
  deliverables?: string[]
  availability?: boolean
}

export interface GetServicesParams {
  page?: number
  limit?: number
  category?: 'resume' | 'interview' | 'mentorship' | 'portfolio' | 'crash-course'
  availability?: boolean
  minPrice?: number
  maxPrice?: number
}

export interface ServicesListResponse {
  success: boolean
  data: {
    services: Service[]
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

export interface ServiceResponse {
  success: boolean
  data: {
    service: Service
  }
  message: string
}

export interface CreateServiceResponse {
  success: boolean
  data: {
    service: Service
  }
  message: string
}

/**
 * Get all services with optional filters
 */
export async function getServices(params?: GetServicesParams): Promise<ServicesListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.category) queryParams.append('category', params.category)
  if (params?.availability !== undefined) queryParams.append('availability', params.availability.toString())
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())

  const queryString = queryParams.toString()
  const endpoint = `/v1/services${queryString ? `?${queryString}` : ''}`
  
  return api.get<ServicesListResponse>(endpoint)
}

/**
 * Get service by ID or slug
 */
export async function getServiceById(idOrSlug: string): Promise<ServiceResponse> {
  return api.get<ServiceResponse>(`/v1/services/${idOrSlug}`)
}

/**
 * Create service (Admin only)
 */
export async function createService(data: CreateServiceData): Promise<CreateServiceResponse> {
  return api.post<CreateServiceResponse>('/v1/services', data)
}

/**
 * Update service (Admin only)
 */
export async function updateService(id: string, data: UpdateServiceData): Promise<ServiceResponse> {
  return api.patch<ServiceResponse>(`/v1/services/${id}`, data)
}

/**
 * Delete service (Admin only)
 */
export async function deleteService(id: string): Promise<{ success: boolean; message: string }> {
  return api.delete<{ success: boolean; message: string }>(`/v1/services/${id}`)
}

