import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  
  // Check if authenticated via stored tokens or user context
  const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
