/**
 * Coupon API
 * Handles coupon validation endpoints
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

/**
 * Validate a coupon code
 */
export const validateCoupon = async (data: ValidateCouponData): Promise<ValidateCouponResponse> => {
  const response = await axiosClient.post<ValidateCouponResponse>('/v1/coupons/validate', data)
  return response.data
}

