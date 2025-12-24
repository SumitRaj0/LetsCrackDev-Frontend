/**
 * Coupon API
 * Handles coupon validation and admin management endpoints
 */

import { axiosClient } from './axiosClient'

export interface ValidateCouponData {
  code: string
  purchaseType: 'course' | 'service'
  itemId: string
  amount: number
}

export interface ValidateCouponResponse {
  success: boolean
  data: {
    valid: boolean
    discount: number
    finalAmount: number
    couponCode?: string
    message: string
  }
  message: string
}

export interface Coupon {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  usageCount: number
  userLimit?: number
  applicableTo: 'all' | 'course' | 'service' | string[]
  isActive: boolean
  description?: string
  createdBy?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCouponData {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  userLimit?: number
  applicableTo: 'all' | 'course' | 'service' | string[]
  description?: string
  isActive?: boolean
}

export interface UpdateCouponData extends Partial<CreateCouponData> {}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

/**
 * Validate a coupon code (public endpoint)
 */
export const validateCoupon = async (data: ValidateCouponData): Promise<ValidateCouponResponse> => {
  const response = await axiosClient.post<ValidateCouponResponse>('/v1/coupons/validate', data)
  return response.data
}

/**
 * Get all coupons (admin only)
 */
export const getAllCoupons = async (): Promise<Coupon[]> => {
  const response = await axiosClient.get<ApiResponse<{ coupons: Coupon[] }>>('/v1/coupons')
  return response.data.data.coupons
}

/**
 * Create a new coupon (admin only)
 */
export const createCoupon = async (data: CreateCouponData): Promise<Coupon> => {
  const response = await axiosClient.post<ApiResponse<{ coupon: Coupon }>>('/v1/coupons', data)
  return response.data.data.coupon
}

/**
 * Update a coupon (admin only)
 */
export const updateCoupon = async (id: string, data: UpdateCouponData): Promise<Coupon> => {
  const response = await axiosClient.put<ApiResponse<{ coupon: Coupon }>>(`/v1/coupons/${id}`, data)
  return response.data.data.coupon
}

/**
 * Delete a coupon (admin only)
 */
export const deleteCoupon = async (id: string): Promise<void> => {
  await axiosClient.delete(`/v1/coupons/${id}`)
}

