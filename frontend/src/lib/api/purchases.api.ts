/**
 * Purchases API Service
 * Handles purchase and payment endpoints
 */

import { api } from './client'

export interface CreateCheckoutData {
  purchaseType: 'service' | 'course'
  serviceId?: string
  courseId?: string
  successUrl?: string
  cancelUrl?: string
  couponCode?: string
}

export interface CheckoutResponse {
  success: boolean
  data: {
    orderId: string
    amount: number
    currency: string
    keyId: string
    purchaseId: string
    successUrl: string
    cancelUrl: string
  }
  message: string
}

export interface VerifyPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface VerifyPaymentResponse {
  success: boolean
  data: {
    purchase: Purchase
    verified: boolean
  }
  message: string
}

export interface Purchase {
  _id: string
  user: string
  purchaseType: 'service' | 'course'
  serviceId?: {
    _id: string
    name: string
    slug: string
    price: number
  }
  courseId?: {
    _id: string
    title: string
    thumbnail?: string
    price: number
  }
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface GetPurchasesParams {
  page?: number
  limit?: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  purchaseType?: 'service' | 'course'
}

export interface PurchasesListResponse {
  success: boolean
  data: {
    purchases: Purchase[]
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

export interface PurchaseResponse {
  success: boolean
  data: {
    purchase: Purchase
  }
  message: string
}

/**
 * Create checkout session (order)
 */
export async function createCheckout(data: CreateCheckoutData): Promise<CheckoutResponse> {
  return api.post<CheckoutResponse>('/v1/purchases/checkout', data)
}

/**
 * Verify payment after Razorpay checkout
 */
export async function verifyPayment(data: VerifyPaymentData): Promise<VerifyPaymentResponse> {
  return api.post<VerifyPaymentResponse>('/v1/purchases/verify', data)
}

/**
 * Get user's purchase history
 */
export async function getPurchases(params?: GetPurchasesParams): Promise<PurchasesListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.purchaseType) queryParams.append('purchaseType', params.purchaseType)

  const queryString = queryParams.toString()
  const endpoint = `/v1/purchases${queryString ? `?${queryString}` : ''}`
  
  return api.get<PurchasesListResponse>(endpoint)
}

/**
 * Get purchase by ID
 */
export async function getPurchaseById(id: string): Promise<PurchaseResponse> {
  return api.get<PurchaseResponse>(`/v1/purchases/${id}`)
}


