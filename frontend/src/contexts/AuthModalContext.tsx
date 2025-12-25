import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

interface AuthModalContextType {
  isOpen: boolean
  mode: 'login' | 'signup'
  openModal: (mode?: 'login' | 'signup', redirectPath?: string) => void
  closeModal: () => void
  redirectPath: string | null
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [redirectPath, setRedirectPath] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()

  const openModal = (newMode: 'login' | 'signup' = 'login', customRedirectPath?: string) => {
    // Use custom redirect path or current location
    const path = customRedirectPath || location.pathname + location.search
    setRedirectPath(path)
    setMode(newMode)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    // Navigate to redirect path after successful login (only if authenticated)
    const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user
    if (redirectPath && isAuthenticated) {
      // Small delay to ensure state updates are complete
      setTimeout(() => {
        navigate(redirectPath)
        setRedirectPath(null)
      }, 100)
    } else if (redirectPath && !isAuthenticated) {
      // If user cancels (clicks X), navigate away from protected route
      // Navigate to premium page if it's a checkout route, otherwise go back
      if (redirectPath.includes('/premium/checkout')) {
        navigate('/premium')
      } else {
        navigate(-1) // Go back to previous page
      }
      setRedirectPath(null)
    } else {
      setRedirectPath(null)
    }
  }

  // Auto-close modal and redirect when user becomes authenticated
  useEffect(() => {
    const isAuthenticated = isAuthenticatedWithPasswordGrant() || !!user
    if (isAuthenticated && isOpen && redirectPath) {
      setIsOpen(false)
      setTimeout(() => {
        navigate(redirectPath)
        setRedirectPath(null)
      }, 100)
    }
  }, [user, isOpen, redirectPath, navigate])

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openModal, closeModal, redirectPath }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}

