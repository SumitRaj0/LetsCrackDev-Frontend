import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    to?: string
    onClick?: () => void
  }
}

/**
 * Standardized EmptyState component for consistent empty states
 * Used when no data/results are found
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  const ActionButton = action?.to ? (
    <Link
      to={action.to}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
    >
      {action.label}
    </Link>
  ) : action?.onClick ? (
    <button
      onClick={action.onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
    >
      {action.label}
    </button>
  ) : null

  return (
    <div className="text-center py-16 sm:py-24">
      <div className="mb-4">{icon || defaultIcon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {ActionButton && <div>{ActionButton}</div>}
    </div>
  )
}
