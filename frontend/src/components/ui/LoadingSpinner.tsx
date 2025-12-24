interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
  showText?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  fullScreen = false,
  showText = false 
}: LoadingSpinnerProps = {}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm'
    : 'flex items-center justify-center'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white ${showText ? 'mb-4' : ''}`}
        ></div>
        {showText && (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  )
}
