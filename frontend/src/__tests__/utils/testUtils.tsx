/**
 * Test Utilities
 * Helper functions for testing React components
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { UserProvider } from '@/contexts/UserContext'
import { ChatbotProvider } from '@/contexts/ChatbotContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { ToastProvider } from '@/contexts/ToastContext'
import authReducer from '@/store/slices/authSlice'
import type { StoredUser } from '@/utils/authStorage'

interface AllTheProvidersProps {
  children: React.ReactNode
  initialTheme?: 'light' | 'dark'
  initialUser?: StoredUser | null
  initialRole?: 'user' | 'admin'
}

function AllTheProviders({ 
  children, 
  initialTheme = 'dark',
  initialUser = null,
  initialRole = 'user'
}: AllTheProvidersProps) {
  // Set initial theme in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', initialTheme)
    
    // Set initial user in localStorage if provided
    if (initialUser) {
      localStorage.setItem('devhub_auth_user', JSON.stringify(initialUser))
    }
  }

  // Create a test store with initial user state
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: initialUser ? {
      auth: {
        user: {
          id: initialUser.sub,
          email: initialUser.email,
          name: initialUser.name || '',
          avatar: initialUser.picture,
          phone: initialUser.phone,
          createdAt: initialUser.createdAt,
          role: initialRole,
        },
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
        status: 'succeeded' as const,
        error: null,
      },
    } : {
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        status: 'idle' as const,
        error: null,
      },
    },
  })

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorProvider>
          <ToastProvider>
            <ThemeProvider>
              <ChatbotProvider>
                <UserProvider>
                  {children}
                </UserProvider>
              </ChatbotProvider>
            </ThemeProvider>
          </ToastProvider>
        </ErrorProvider>
      </BrowserRouter>
    </Provider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark'
  initialUser?: StoredUser | null
  initialRole?: 'user' | 'admin'
}

export function renderWithProviders(
  ui: ReactElement,
  { initialTheme, initialUser, initialRole, ...renderOptions }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        initialTheme={initialTheme} 
        initialUser={initialUser}
        initialRole={initialRole}
        {...props}
      />
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { renderWithProviders as render }

