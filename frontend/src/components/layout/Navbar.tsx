import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useChatbot } from '@/contexts/ChatbotContext'
import { clearAuthTokens } from '@/utils/authStorage'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/index'

export function Navbar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { isOpen: isChatbotOpen, width: chatbotWidth, openChatbot } = useChatbot()
  const { isOpen: isAuthModalOpen, mode: authModalMode, openModal, closeModal } = useAuthModal()

  const { user, isLoading: userLoading } = useUser()
  
  // Get user from Redux to check role
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  const isAdmin = reduxUser?.role === 'admin'
  
  // User is logged in if they have user data (from either Auth0 or password grant)
  const isLoggedIn = !!user

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = () => {
    openModal('login')
  }

  const handleSignup = () => {
    openModal('signup')
  }

  const handleLogout = async () => {
    // Import cancelAllRequests dynamically to avoid circular dependency
    const { cancelAllRequests } = await import('@/lib/api/axiosClient')
    cancelAllRequests()
    
    // Clear local auth tokens
    clearAuthTokens()

    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    
    // Navigate to home instead of reload (better UX)
    window.location.href = '/'
  }

  // Scroll to top when clicking navigation links
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 z-50 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      style={{
        right: isChatbotOpen ? `${chatbotWidth}px` : '0px',
        transition:
          'right 0.1s ease-out, background-color 0.3s ease-out, backdrop-filter 0.3s ease-out',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Navigate to home */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2 group cursor-pointer">
            {/* Fixed-height wrapper so layout height stays small */}
            <div className="h-12 flex items-center overflow-visible">
              <img
                src="/letscrackdev-logo.png"
                alt="LetsCrackDev logo"
                className="h-40 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`transition-colors duration-200 ${
                isActive('/')
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/resources"
              onClick={handleLinkClick}
              className={`transition-colors duration-200 ${
                isActive('/resources')
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/categories"
              onClick={handleLinkClick}
              className={`transition-colors duration-200 ${
                isActive('/categories')
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/premium"
              onClick={handleLinkClick}
              className={`transition-colors duration-200 ${
                isActive('/premium')
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Premium
            </Link>
          </div>

          {/* Desktop Theme Toggle and Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* AI Assistant Button - Only visible when logged in */}
            {isLoggedIn && (
              <button
                onClick={openChatbot}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-semibold text-sm shadow-md hover:shadow-lg"
                title="AI Assistant"
              >
                {/* Google-style sparkle AI icon (similar to Gemini) */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L15.09 8.26L24 10L15.09 11.74L12 20L8.91 11.74L0 10L8.91 8.26L12 0Z" />
                  <path d="M12 4L10.5 7.5L7 9L10.5 10.5L12 14L13.5 10.5L17 9L13.5 7.5L12 4Z" fill="white" opacity="0.4" />
                </svg>
                <span>AI</span>
              </button>
            )}

            {/* Conditional rendering: Profile dropdown if logged in, Sign up if not */}
            {userLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-gray-900">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* Navbar chip: only avatar + caret, no name/email for a clean landing look */}
                  <svg
                    className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user?.email || 'user@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            handleLinkClick()
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="font-medium">View Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            handleLinkClick()
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => {
                              setIsProfileDropdownOpen(false)
                              handleLinkClick()
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-t border-gray-200 dark:border-gray-700 mt-1 pt-2"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            <span className="font-medium">Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignup}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`transition-colors ${
                  isActive('/')
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Home
              </Link>
              <Link
                to="/resources"
                onClick={handleLinkClick}
                className={`transition-colors ${
                  isActive('/resources')
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Resources
              </Link>
              <Link
                to="/categories"
                onClick={handleLinkClick}
                className={`transition-colors ${
                  isActive('/categories')
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Categories
              </Link>
              <Link
                to="/premium"
                onClick={handleLinkClick}
                className={`transition-colors ${
                  isActive('/premium')
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Premium
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 space-y-2">
                {/* AI Assistant Button - Only visible when logged in */}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      openChatbot()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-md"
                    title="AI Assistant"
                  >
                    {/* Google-style sparkle AI icon (similar to Gemini) */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0L15.09 8.26L24 10L15.09 11.74L12 20L8.91 11.74L0 10L8.91 8.26L12 0Z" />
                      <path d="M12 4L10.5 7.5L7 9L10.5 10.5L12 14L13.5 10.5L17 9L13.5 7.5L12 4Z" fill="white" opacity="0.4" />
                    </svg>
                    <span>AI Assistant</span>
                  </button>
                )}

                {/* Conditional rendering: Profile if logged in, Sign up if not */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleLogin()
                      }}
                      className="w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors py-2.5 rounded-lg font-medium text-sm"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleSignup()
                      }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors py-2.5 rounded-lg font-medium text-sm shadow-sm"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Auth Modal for login/signup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeModal}
        initialMode={authModalMode}
      />
    </nav>
  )
}
