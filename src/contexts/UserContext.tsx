/**
 * User Context
 * Provides current user data from local auth storage
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { StoredUser } from '@/utils/authStorage'
import { getStoredUser, isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

interface UserContextType {
  user: StoredUser | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const loadUser = async () => {
    const isAuthenticated = isAuthenticatedWithPasswordGrant()
    if (!isAuthenticated) {
      setUser(null)
    } else {
      const stored = getStoredUser()
      setUser(stored)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const refreshUser = async () => {
    await loadUser()
  }

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
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

