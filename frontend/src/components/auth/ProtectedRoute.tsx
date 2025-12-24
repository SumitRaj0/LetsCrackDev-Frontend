import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const location = useLocation()
  
  // Check if authenticated via stored tokens or user context
  const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    const redirectPath = location.pathname + location.search
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }

  return <>{children}</>
}
