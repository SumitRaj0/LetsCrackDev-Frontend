import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getResourceById, toggleResourceBookmark } from '@/lib/api/resources.api'
import { mapBackendResourceToFrontend } from '@/lib/api/resourceMapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useUser } from '@/contexts/UserContext'

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const { user } = useUser()
  const [resource, setResource] = useState<ReturnType<typeof mapBackendResourceToFrontend> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch resource from API with request cancellation
  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const fetchResource = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null) // Clear any previous errors
        const response = await getResourceById(id)
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return
        }

        if (response.success && response.data.resource) {
          const mappedResource = mapBackendResourceToFrontend(response.data.resource)
          
          // Validate URL is present and valid
          if (!mappedResource.url || mappedResource.url.trim() === '') {
            console.error('Resource URL is missing or empty:', {
              resource: response.data.resource,
              mappedResource,
              link: response.data.resource.link
            })
            setError('Resource URL is missing. Please contact support.')
            return
          }
          
          // Ensure URL is properly formatted
          const url = mappedResource.url.trim()
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            console.error('Resource URL is not a valid HTTP/HTTPS URL:', url)
            setError('Resource URL is invalid. Please contact support.')
            return
          }
          
          setResource(mappedResource)
        } else {
          setError('Resource not found')
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error?.name === 'AbortError' || abortController.signal.aborted) {
          return
        }
        
        // Extract user-friendly error message
        let errorMessage = 'Failed to load resource'
        if (error?.response?.status === 404 || error?.message?.includes('not found')) {
          errorMessage = 'Resource not found. It may have been removed or the link is incorrect.'
        } else if (error?.response?.status === 400 || error?.message?.includes('Invalid')) {
          errorMessage = 'Invalid resource ID. Please check the link and try again.'
        } else if (error?.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (error?.message) {
          errorMessage = error.message
        }
        
        setError(errorMessage)
        
        // Still log the error for debugging
        handleError(error, {
          showToast: false, // Don't show toast, we'll show error in UI
          logError: true,
          context: { component: 'ResourceDetail', action: 'fetchResource' },
        })
      } finally {
        // Only update loading state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchResource()

    // Listen for refetch event
    const handleRefetch = () => {
      fetchResource()
    }
    window.addEventListener('refetch', handleRefetch)

    // Cleanup function
    return () => {
      abortController.abort()
      window.removeEventListener('refetch', handleRefetch)
    }
  }, [id, handleError])

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (!id) return

    try {
      setIsTogglingBookmark(true)
      
      // Check if token exists before making request
      const { getStoredAccessToken } = await import('@/utils/authStorage')
      const token = getStoredAccessToken()
      if (!token) {
        // Token missing, redirect to login
        showSuccess('Please log in again to bookmark resources')
        navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }
      
      const response = await toggleResourceBookmark(id)
      if (response.success) {
        setIsBookmarked(response.data.bookmarked)
        showSuccess(
          response.data.bookmarked ? 'Resource bookmarked!' : 'Resource unbookmarked!'
        )
      }
    } catch (error: any) {
      // Handle authentication errors specifically
      if (error?.status === 401 || error?.message?.includes('Authentication token missing')) {
        showSuccess('Your session has expired. Please log in again.')
        navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))
      } else {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'ResourceDetail', action: 'handleBookmark' },
        })
      }
    } finally {
      setIsTogglingBookmark(false)
    }
  }

  if (isLoading) {
    return (
      <LoadingSpinner fullScreen showText />
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                setError(null)
                setIsLoading(true)
                // Trigger refetch by re-running effect
                const event = new Event('refetch')
                window.dispatchEvent(event)
              }}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/resources')}
            >
              Back to Resources
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Resource Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/resources')}>
            Back to Resources
          </Button>
        </Card>
      </div>
    )
  }

  const relatedResources: typeof resource[] = [] // TODO: Fetch related resources from API

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        })
        showSuccess('Link shared successfully!')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showSuccess('Link copied to clipboard!')
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== 'AbortError') {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'ResourceDetail', action: 'handleShare' },
        })
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Resources
          </Button>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary" size="md">
                {resource.category}
              </Badge>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {resource.rating}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">{resource.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{resource.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              {resource.url && resource.url.trim() !== '' ? (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => {
                    if (resource.url && resource.url.trim() !== '') {
                      window.open(resource.url, '_blank', 'noopener,noreferrer')
                    }
                  }}
                >
                  Visit Resource
                </Button>
              ) : (
                <Button variant="primary" size="lg" disabled>
                  Visit Resource (URL not available)
                </Button>
              )}
              {user ? (
                <Button
                  variant={isBookmarked ? 'primary' : 'outline'}
                  onClick={handleBookmark}
                  size="lg"
                  disabled={isTogglingBookmark}
                  className="flex items-center justify-center gap-2"
                >
                  {isTogglingBookmark ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : isBookmarked ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      <span>Bookmark</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span>Bookmark</span>
                </Button>
              )}
              <Button variant="outline" onClick={handleShare} size="lg">
                Share
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} size="lg">
                Go to Dashboard
              </Button>
            </div>

            {/* Additional Navigation Links */}
            <div className="mt-4 flex items-center gap-3 flex-wrap text-sm">
              <Button variant="ghost" onClick={() => navigate('/categories')} size="sm">
                Explore Categories
              </Button>
              <Button variant="ghost" onClick={() => navigate('/premium')} size="sm">
                View Premium Options
              </Button>
              <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                Login/Signup
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard/saved')} size="sm">
                Access Saved Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* What You'll Learn */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-3">
              {[
                'Master core concepts and fundamentals',
                'Build real-world projects',
                'Learn best practices',
                'Understand advanced techniques',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {resource.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This comprehensive resource provides in-depth coverage with practical examples, code
              snippets, and real-world use cases. The content is regularly updated to reflect the
              latest best practices.
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedResources.map(related => (
                  <Link key={related.id} to={`/resources/${related.id}`} className="block group">
                    <Card className="p-4 hover-lift">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span>{related.rating}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
