import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ChatbotProvider } from '@/contexts/ChatbotContext'
import { ToastProvider, useToast } from '@/contexts/ToastContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { UserProvider } from '@/contexts/UserContext'
import App from './App'
import { store } from './store'
import './index.css'

// Wrapper to provide toast function to ErrorProvider
// eslint-disable-next-line react-refresh/only-export-components
function ErrorProviderWrapper({ children }: { children: React.ReactNode }) {
  const { showError } = useToast()
  return <ErrorProvider showToastFn={showError}>{children}</ErrorProvider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <ErrorProviderWrapper>
              <UserProvider>
                <ChatbotProvider>
                  <App />
                </ChatbotProvider>
              </UserProvider>
            </ErrorProviderWrapper>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
)
