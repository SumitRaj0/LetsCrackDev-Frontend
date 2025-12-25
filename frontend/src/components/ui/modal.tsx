import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  blankBackground?: boolean // New prop for blank background
}

export function Modal({ isOpen, onClose, children, variant = 'dark', size = 'md', blankBackground = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-5xl',
    full: 'max-w-full mx-4',
  }

  const modalClasses =
    variant === 'light'
      ? `relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`
      : `relative bg-gray-900 rounded-lg shadow-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`

  const backgroundClasses = blankBackground
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-transparent'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'

  return createPortal(
    <div
      className={backgroundClasses}
      onClick={blankBackground ? undefined : onClose}
    >
      <div className={modalClasses} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}
