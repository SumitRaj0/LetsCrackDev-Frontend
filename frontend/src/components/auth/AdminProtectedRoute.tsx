import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const location = useLocation()
  
  // Get user from Redux (has role field)
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  
  // Check if authenticated
  const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user
  
  // Check if user is admin (from Redux or need to fetch)
  const isAdmin = reduxUser?.role === 'admin'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    const redirectPath = location.pathname + location.search
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }

  if (!isAdmin) {
    // User is authenticated but not admin - redirect to home
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need admin privileges to access this page.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

