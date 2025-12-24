/**
 * User API Service
 * Handles user profile and account management endpoints
 */

import { api } from './client'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserProfileResponse {
  success: boolean
  data: {
    user: UserProfile
  }
  message: string
}

export interface UpdateProfileResponse {
  success: boolean
  data: {
    user: UserProfile
  }
  message: string
}

export interface ChangePasswordResponse {
  success: boolean
  data: {
    success: boolean
  }
  message: string
}

export interface DeleteAccountResponse {
  success: boolean
  data: {
    success: boolean
  }
  message: string
}

/**
 * Get user profile
 */
export async function getProfile(): Promise<UserProfileResponse> {
  return api.get<UserProfileResponse>('/v1/user/profile')
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
  return api.patch<UpdateProfileResponse>('/v1/user/profile', data)
}

/**
 * Change password
 */
export async function changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
  return api.put<ChangePasswordResponse>('/v1/user/change-password', data)
}

/**
 * Delete account (soft delete)
 */
export async function deleteAccount(): Promise<DeleteAccountResponse> {
  return api.delete<DeleteAccountResponse>('/v1/user/account')
}

