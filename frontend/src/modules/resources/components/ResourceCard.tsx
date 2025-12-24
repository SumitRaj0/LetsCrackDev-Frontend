import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Resource } from '../types'
import { toggleResourceBookmark } from '@/lib/api/resources.api'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useUser } from '@/contexts/UserContext'

interface ResourceCardProps {
  resource: Resource
  isBookmarked?: boolean
  onBookmarkChange?: (bookmarked: boolean) => void
}

// Category icons mapping
const getCategoryIcon = (categorySlug: string) => {
  const icons: Record<string, JSX.Element> = {
    frontend: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    backend: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    devops: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
    'ai-ml': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    'ui-ux': (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    dsa: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  }
  return icons[categorySlug] || null
}

export function ResourceCard({ resource, isBookmarked: initialBookmarked, onBookmarkChange }: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false)
  const [isToggling, setIsToggling] = useState(false)
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const { user } = useUser()
  const navigate = useNavigate()

  const formatSavedCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/resources/${resource.id}`))
      return
    }

    try {
      setIsToggling(true)
      const response = await toggleResourceBookmark(resource.id)
      if (response.success) {
        const newBookmarked = response.data.bookmarked
        setIsBookmarked(newBookmarked)
        onBookmarkChange?.(newBookmarked)
        showSuccess(newBookmarked ? 'Resource bookmarked!' : 'Resource unbookmarked!')
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'ResourceCard', action: 'handleBookmarkClick' },
      })
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Link to={`/resources/${resource.id}`} className="group block h-full">
      <div className="h-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out relative before:absolute before:inset-0 before:rounded-xl before:pointer-events-none before:bg-gradient-to-br before:from-indigo-500/10 before:via-purple-500/10 before:to-pink-500/10 dark:before:from-indigo-400/20 dark:before:via-purple-400/20 dark:before:to-pink-400/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 hover:border-indigo-300 dark:hover:border-indigo-600">
        {/* Category Badge and Rating */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {getCategoryIcon(resource.categorySlug)}
            <span>{resource.category}</span>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={handleBookmarkClick}
                disabled={isToggling}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-20 relative"
                title={isBookmarked ? 'Unbookmark' : 'Bookmark'}
              >
                {isToggling ? (
                  <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : isBookmarked ? (
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                )}
              </button>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {resource.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>

        {/* Saved Count and View Details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {formatSavedCount(resource.savedCount)} saved
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
            <span>View Details</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
