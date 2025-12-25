/**
 * Custom Auth Storage for Password Grant Tokens
 * Stores tokens in a way that works with our API client
 */

import { logger } from './logger'

const TOKEN_KEY = 'devhub_auth_tokens'
const USER_KEY = 'devhub_auth_user'

export interface StoredTokens {
  accessToken: string
  refreshToken?: string // Backend JWT tokens
  idToken?: string // Auth0 tokens (legacy)
  expiresAt: number // timestamp
}

export interface StoredUser {
  sub: string
  email: string
  name?: string
  picture?: string
  phone?: string
  createdAt?: string
}

/**
 * Store authentication tokens
 * Supports both backend JWT (accessToken + refreshToken) and Auth0 (idToken)
 */
export function storeAuthTokens(tokens: { 
  accessToken: string
  refreshToken?: string
  idToken?: string
  expiresIn?: number 
}): void {
  try {
  const expiresAt = tokens.expiresIn 
    ? Date.now() + tokens.expiresIn * 1000 
    : Date.now() + 15 * 60 * 1000 // Default 15 minutes (backend access token)

  const stored: StoredTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    idToken: tokens.idToken,
    expiresAt,
  }

  localStorage.setItem(TOKEN_KEY, JSON.stringify(stored))
  } catch (error) {
    // Handle localStorage errors (quota exceeded, disabled, etc.)
    logger.error('Failed to store auth tokens:', error)
    // Fallback to sessionStorage if localStorage fails
    try {
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
        expiresAt: tokens.expiresIn 
          ? Date.now() + tokens.expiresIn * 1000 
          : Date.now() + 15 * 60 * 1000,
      }))
    } catch (sessionError) {
      logger.error('Failed to store auth tokens in sessionStorage:', sessionError)
      throw new Error('Unable to store authentication tokens. Please check your browser settings.')
    }
  }
}

/**
 * Get stored refresh token
 */
export function getStoredRefreshToken(): string | null {
  try {
    // Try localStorage first
    let stored = localStorage.getItem(TOKEN_KEY)
    
    // Fallback to sessionStorage if localStorage is empty
    if (!stored) {
      stored = sessionStorage.getItem(TOKEN_KEY)
    }
    
    if (!stored) return null

    const tokens: StoredTokens = JSON.parse(stored)
    return tokens.refreshToken || null
  } catch {
    return null
  }
}

/**
 * Get stored access token
 */
export function getStoredAccessToken(): string | null {
  try {
    // Try localStorage first
    let stored = localStorage.getItem(TOKEN_KEY)
    
    // Fallback to sessionStorage if localStorage is empty
    if (!stored) {
      stored = sessionStorage.getItem(TOKEN_KEY)
    }
    
    if (!stored) return null

    const tokens: StoredTokens = JSON.parse(stored)
    
    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      clearAuthTokens()
      return null
    }

    return tokens.accessToken
  } catch {
    return null
  }
}

/**
 * Get stored ID token
 */
export function getStoredIdToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) return null

    const tokens: StoredTokens = JSON.parse(stored)
    return tokens.idToken ?? null
  } catch {
    return null
  }
}

/**
 * Store user info
 */
export function storeAuthUser(user: StoredUser): void {
  try {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    logger.error('Failed to store user data:', error)
    // Fallback to sessionStorage
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (sessionError) {
      logger.error('Failed to store user data in sessionStorage:', sessionError)
      // Non-critical, continue without storing
    }
  }
}

/**
 * Get stored user info
 */
export function getStoredUser(): StoredUser | null {
  try {
    // Try localStorage first
    let stored = localStorage.getItem(USER_KEY)
    
    // Fallback to sessionStorage
    if (!stored) {
      stored = sessionStorage.getItem(USER_KEY)
    }
    
    if (!stored) return null
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export function isAuthenticatedWithPasswordGrant(): boolean {
  const token = getStoredAccessToken()
  return !!token
}

/**
 * Clear all auth data
 */
export function clearAuthTokens(): void {
  try {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
    // Also clear sessionStorage fallback
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  } catch (error) {
    logger.error('Failed to clear auth tokens:', error)
    // Continue anyway - tokens may not exist
  }
}

