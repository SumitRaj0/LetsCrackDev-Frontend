/**
 * Auth Storage Utility Tests
 * Tests for authentication token and user storage functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  storeAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredIdToken,
  storeAuthUser,
  getStoredUser,
  isAuthenticatedWithPasswordGrant,
  clearAuthTokens,
  type StoredUser,
} from '@/utils/authStorage'

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  describe('storeAuthTokens', () => {
    it('should store tokens in localStorage', () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }

      storeAuthTokens(tokens)

      const stored = localStorage.getItem('devhub_auth_tokens')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.accessToken).toBe('test-access-token')
      expect(parsed.refreshToken).toBe('test-refresh-token')
      expect(parsed.expiresAt).toBeGreaterThan(Date.now())
    })

    it('should store tokens with expiresIn', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresIn: 3600, // 1 hour
      }

      storeAuthTokens(tokens)

      const stored = localStorage.getItem('devhub_auth_tokens')
      const parsed = JSON.parse(stored!)
      const expectedExpiry = Date.now() + 3600 * 1000
      expect(parsed.expiresAt).toBeGreaterThanOrEqual(expectedExpiry - 1000)
      expect(parsed.expiresAt).toBeLessThanOrEqual(expectedExpiry + 1000)
    })

    it('should use default expiry when expiresIn not provided', () => {
      const tokens = {
        accessToken: 'test-access-token',
      }

      storeAuthTokens(tokens)

      const stored = localStorage.getItem('devhub_auth_tokens')
      const parsed = JSON.parse(stored!)
      const expectedExpiry = Date.now() + 15 * 60 * 1000 // 15 minutes
      expect(parsed.expiresAt).toBeGreaterThanOrEqual(expectedExpiry - 1000)
      expect(parsed.expiresAt).toBeLessThanOrEqual(expectedExpiry + 1000)
    })

    it('should store idToken for Auth0 tokens', () => {
      const tokens = {
        accessToken: 'test-access-token',
        idToken: 'test-id-token',
      }

      storeAuthTokens(tokens)

      const stored = localStorage.getItem('devhub_auth_tokens')
      const parsed = JSON.parse(stored!)
      expect(parsed.idToken).toBe('test-id-token')
    })

    it('should fallback to sessionStorage if localStorage fails', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Quota exceeded')
      })

      const tokens = {
        accessToken: 'test-access-token',
      }

      storeAuthTokens(tokens)

      const stored = sessionStorage.getItem('devhub_auth_tokens')
      expect(stored).toBeTruthy()

      // Restore
      localStorage.setItem = originalSetItem
    })
  })

  describe('getStoredAccessToken', () => {
    it('should return access token from localStorage', () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredAccessToken()
      expect(token).toBe('test-access-token')
    })

    it('should return null if no token stored', () => {
      const token = getStoredAccessToken()
      expect(token).toBeNull()
    })

    it('should return null if token is expired', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresAt: Date.now() - 1000, // Expired
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredAccessToken()
      expect(token).toBeNull()
      // Should also clear expired tokens
      expect(localStorage.getItem('devhub_auth_tokens')).toBeNull()
    })

    it('should fallback to sessionStorage if localStorage is empty', () => {
      const tokens = {
        accessToken: 'session-token',
        expiresAt: Date.now() + 3600000,
      }
      sessionStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredAccessToken()
      expect(token).toBe('session-token')
    })

    it('should return null if token data is invalid', () => {
      localStorage.setItem('devhub_auth_tokens', 'invalid-json')

      const token = getStoredAccessToken()
      expect(token).toBeNull()
    })
  })

  describe('getStoredRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredRefreshToken()
      expect(token).toBe('test-refresh-token')
    })

    it('should return null if no refresh token', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredRefreshToken()
      expect(token).toBeNull()
    })

    it('should fallback to sessionStorage', () => {
      const tokens = {
        accessToken: 'test-access-token',
        refreshToken: 'session-refresh-token',
        expiresAt: Date.now() + 3600000,
      }
      sessionStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredRefreshToken()
      expect(token).toBe('session-refresh-token')
    })
  })

  describe('getStoredIdToken', () => {
    it('should return id token from localStorage', () => {
      const tokens = {
        accessToken: 'test-access-token',
        idToken: 'test-id-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredIdToken()
      expect(token).toBe('test-id-token')
    })

    it('should return undefined if no id token', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const token = getStoredIdToken()
      expect(token).toBeUndefined()
    })
  })

  describe('storeAuthUser', () => {
    it('should store user in localStorage', () => {
      const user: StoredUser = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      storeAuthUser(user)

      const stored = localStorage.getItem('devhub_auth_user')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.sub).toBe('user-123')
      expect(parsed.email).toBe('test@example.com')
      expect(parsed.name).toBe('Test User')
    })

    it('should fallback to sessionStorage if localStorage fails', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Quota exceeded')
      })

      const user: StoredUser = {
        sub: 'user-123',
        email: 'test@example.com',
      }

      storeAuthUser(user)

      const stored = sessionStorage.getItem('devhub_auth_user')
      expect(stored).toBeTruthy()

      localStorage.setItem = originalSetItem
    })
  })

  describe('getStoredUser', () => {
    it('should return user from localStorage', () => {
      const user: StoredUser = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }
      localStorage.setItem('devhub_auth_user', JSON.stringify(user))

      const retrieved = getStoredUser()
      expect(retrieved).toEqual(user)
    })

    it('should return null if no user stored', () => {
      const user = getStoredUser()
      expect(user).toBeNull()
    })

    it('should fallback to sessionStorage', () => {
      const user: StoredUser = {
        sub: 'user-123',
        email: 'test@example.com',
      }
      sessionStorage.setItem('devhub_auth_user', JSON.stringify(user))

      const retrieved = getStoredUser()
      expect(retrieved).toEqual(user)
    })

    it('should return null if data is invalid', () => {
      localStorage.setItem('devhub_auth_user', 'invalid-json')

      const user = getStoredUser()
      expect(user).toBeNull()
    })
  })

  describe('isAuthenticatedWithPasswordGrant', () => {
    it('should return true if valid token exists', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresAt: Date.now() + 3600000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const isAuth = isAuthenticatedWithPasswordGrant()
      expect(isAuth).toBe(true)
    })

    it('should return false if no token', () => {
      const isAuth = isAuthenticatedWithPasswordGrant()
      expect(isAuth).toBe(false)
    })

    it('should return false if token is expired', () => {
      const tokens = {
        accessToken: 'test-access-token',
        expiresAt: Date.now() - 1000,
      }
      localStorage.setItem('devhub_auth_tokens', JSON.stringify(tokens))

      const isAuth = isAuthenticatedWithPasswordGrant()
      expect(isAuth).toBe(false)
    })
  })

  describe('clearAuthTokens', () => {
    it('should clear all auth data from localStorage and sessionStorage', () => {
      localStorage.setItem('devhub_auth_tokens', '{}')
      localStorage.setItem('devhub_auth_user', '{}')
      sessionStorage.setItem('devhub_auth_tokens', '{}')
      sessionStorage.setItem('devhub_auth_user', '{}')

      clearAuthTokens()

      expect(localStorage.getItem('devhub_auth_tokens')).toBeNull()
      expect(localStorage.getItem('devhub_auth_user')).toBeNull()
      expect(sessionStorage.getItem('devhub_auth_tokens')).toBeNull()
      expect(sessionStorage.getItem('devhub_auth_user')).toBeNull()
    })

    it('should not throw if tokens do not exist', () => {
      expect(() => clearAuthTokens()).not.toThrow()
    })
  })
})


