/**
 * Auth API Service
 * Handles authentication endpoints including token refresh
 */

import axiosClient from './axiosClient'

export interface RefreshTokenResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
  }
  message: string
}

export interface UserResponse {
  success: boolean
  data: {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      role: 'user' | 'admin'
      phone?: string
      createdAt: string
    }
  }
  message: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

/**
 * Refresh access token using refresh token
 * Note: This endpoint doesn't require auth token (public)
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await axiosClient.post<RefreshTokenResponse>('/v1/auth/refresh-token', { refreshToken })
  return response.data
}

/**
 * Get current user (session validation)
 * Verifies token is valid and returns user data
 */
export async function getMe(): Promise<UserResponse> {
  const response = await axiosClient.get<UserResponse>('/v1/auth/me')
  return response.data
}

/**
 * Request password reset
 * Sends reset link to user's email
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await axiosClient.post<ForgotPasswordResponse>('/v1/auth/forgot-password', { email })
  return response.data
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<ResetPasswordResponse> {
  const response = await axiosClient.post<ResetPasswordResponse>('/v1/auth/reset-password', {
    token,
    password,
  })
  return response.data
}
