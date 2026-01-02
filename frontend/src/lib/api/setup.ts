/**
 * API Client Setup
 * Initializes the API client with token getter
 */

import { setAuthTokenGetter } from './client'
import { getStoredAccessToken } from '@/utils/authStorage'

/**
 * Initialize API client
 * Sets up the token getter for authenticated requests
 */
export function setupApiClient(): void {
  setAuthTokenGetter(async () => {
    return getStoredAccessToken()
  })
}

