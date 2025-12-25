/**
 * Manual Auth Service (Backend)
 * Uses our own Node/Mongo backend for email/password auth.
 */

import { api } from '@/lib/api/client'
import { logger } from '@/utils/logger'

const AUTH_BASE = '/auth'

/**
 * Sign up with email and password using our backend
 */
export async function signupWithEmailPassword(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    logger.log('[Auth Service] Signing up user via backend:', { email, name })

    const response = await api.post<{ success: boolean; message?: string; error?: string }>(
      `${AUTH_BASE}/signup`,
      {
        name,
        email,
        password,
        // Frontend can optionally send avatar; backend treats it as optional
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      }
    )

    if (response.success) {
      return { success: true }
    }

    return {
      success: false,
      error: response.error || response.message || 'Signup failed',
    }
  } catch (error) {
    logger.error('[Auth Service] Signup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

/**
 * Login with email and password using our backend
 * Returns the tokens and user info needed for authentication
 */
export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<{ 
  success: boolean
  tokens?: { 
    accessToken: string
    idToken: string
    expiresIn?: number
  }
  user?: {
    sub: string
    email: string
    name?: string
    picture?: string
  }
  error?: string 
}> {
  try {
    type BackendLoginResponse = {
      success: boolean
      data?: {
        user: {
          id: string
          name: string
          email: string
          avatar?: string
          role?: string
        }
        accessToken: string
        refreshToken: string
      }
      message?: string
      error?: string
    }

    const data = await api.post<BackendLoginResponse>(`${AUTH_BASE}/login`, {
      email,
      password,
    })

    if (data.success && data.data) {
      const { user, accessToken } = data.data

      const userInfo = {
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.avatar,
      }

      return {
        success: true,
        tokens: {
          accessToken,
          // We don't use ID token with our backend auth – reuse access token for storage compatibility
          idToken: accessToken,
          // Optional: 15 minutes default
          expiresIn: 15 * 60,
        },
        user: userInfo,
      }
    }

    return {
      success: false,
      error: data.error || data.message || 'Login failed',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

