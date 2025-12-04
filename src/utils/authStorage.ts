/**
 * Custom Auth Storage for Password Grant Tokens
 * Stores tokens in a way that works with our API client
 */

const TOKEN_KEY = 'devhub_auth_tokens'
const USER_KEY = 'devhub_auth_user'

export interface StoredTokens {
  accessToken: string
  idToken: string
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
 */
export function storeAuthTokens(tokens: { accessToken: string; idToken: string; expiresIn?: number }): void {
  const expiresAt = tokens.expiresIn 
    ? Date.now() + tokens.expiresIn * 1000 
    : Date.now() + 3600 * 1000 // Default 1 hour

  const stored: StoredTokens = {
    accessToken: tokens.accessToken,
    idToken: tokens.idToken,
    expiresAt,
  }

  localStorage.setItem(TOKEN_KEY, JSON.stringify(stored))
}

/**
 * Get stored access token
 */
export function getStoredAccessToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
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
    return tokens.idToken
  } catch {
    return null
  }
}

/**
 * Store user info
 */
export function storeAuthUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Get stored user info
 */
export function getStoredUser(): StoredUser | null {
  try {
    const stored = localStorage.getItem(USER_KEY)
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
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

