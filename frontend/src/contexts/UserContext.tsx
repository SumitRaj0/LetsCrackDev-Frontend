/**
 * User Context
 * Provides current user data - synchronized with Redux and localStorage
 * Uses Redux as single source of truth, falls back to localStorage
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/index'
import type { StoredUser } from '@/utils/authStorage'
import { getStoredUser, isAuthenticatedWithPasswordGrant, storeAuthUser } from '@/utils/authStorage'
import { logout, setUser as setReduxUser } from '@/store/slices/authSlice'
import { getMe } from '@/lib/api/auth.api'

interface UserContextType {
  user: StoredUser | null
  isLoading: boolean
  refreshUser: () => Promise<void>
  validateSession: () => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  
  // Get user from Redux store (single source of truth)
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  
  // Sync Redux user to UserContext
  useEffect(() => {
    if (reduxUser) {
      // Convert Redux user format to StoredUser format
      const storedUser: StoredUser = {
        sub: reduxUser.id,
        email: reduxUser.email,
        name: reduxUser.name,
        picture: reduxUser.avatar,
        phone: reduxUser.phone,
        createdAt: reduxUser.createdAt,
      }
      setUser(storedUser)
      // Also sync to localStorage
      storeAuthUser(storedUser)
    } else {
      // If Redux has no user, check localStorage
      const stored = getStoredUser()
      setUser(stored)
    }
  }, [reduxUser])
  
  const loadUser = async () => {
    const isAuthenticated = isAuthenticatedWithPasswordGrant()
    if (!isAuthenticated) {
      setUser(null)
      setIsLoading(false)
      return
    }
    
    // If Redux has user, use it (already synced in useEffect)
    if (reduxUser) {
      setIsLoading(false)
      return
    }
    
    // Otherwise, load from localStorage
    const stored = getStoredUser()
    setUser(stored)
    setIsLoading(false)
  }

  /**
   * Validate session with backend
   * Verifies token is still valid on server
   */
  const validateSession = async (): Promise<boolean> => {
    if (!isAuthenticatedWithPasswordGrant()) {
      return false
    }

    try {
      const response = await getMe()
      if (response.success && response.data?.user) {
        // Update user data from backend
        const backendUser = response.data.user
        const storedUser: StoredUser = {
          sub: backendUser.id,
          email: backendUser.email,
          name: backendUser.name,
          picture: backendUser.avatar,
          phone: backendUser.phone,
          createdAt: backendUser.createdAt,
        }
        setUser(storedUser)
        storeAuthUser(storedUser)
        
        // Also update Redux with role
        dispatch(setReduxUser({
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          avatar: backendUser.avatar,
          role: backendUser.role,
          phone: backendUser.phone,
          createdAt: backendUser.createdAt,
        }))
        
        return true
      }
      return false
    } catch (error) {
      // Session invalid, clear auth
      dispatch(logout())
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    loadUser()
    
    // Validate session on mount if authenticated
    if (isAuthenticatedWithPasswordGrant()) {
      validateSession().catch(() => {
        // Validation failed, already handled in validateSession
      })
    }
  }, [])

  const refreshUser = async () => {
    await loadUser()
    // Also validate session when refreshing
    if (isAuthenticatedWithPasswordGrant()) {
      await validateSession()
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, validateSession }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

