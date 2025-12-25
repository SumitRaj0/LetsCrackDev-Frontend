import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { AuthModal } from '@/components/auth/AuthModal'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const location = useLocation()
  const { isOpen, mode, openModal, closeModal } = useAuthModal()
  
  // Check if authenticated via stored tokens or user context
  const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Open auth modal instead of redirecting
      const redirectPath = location.pathname + location.search
      openModal('login', redirectPath)
    }
  }, [isLoading, isAuthenticated, location, openModal])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Show auth modal with blank background
    return (
      <>
        <AuthModal isOpen={isOpen} onClose={closeModal} initialMode={mode} blankBackground={true} />
        {/* Render children in background (will be covered by modal) */}
        <div style={{ opacity: 0, pointerEvents: 'none' }}>{children}</div>
      </>
    )
  }

  return <>{children}</>
}
