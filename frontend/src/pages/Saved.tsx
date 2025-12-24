import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getBookmarkedResources } from '@/lib/api/resources.api'
import { mapBackendResourceToFrontend } from '@/lib/api/resourceMapper'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useUser } from '@/contexts/UserContext'
import { useNavigate } from 'react-router-dom'

export default function Saved() {
  const [savedResources, setSavedResources] = useState<ReturnType<typeof mapBackendResourceToFrontend>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { handleError } = useErrorHandler()
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookmarkedResources = async () => {
      if (!user) {
        navigate('/login?redirect=' + encodeURIComponent('/dashboard/saved'))
        return
      }

      try {
        setIsLoading(true)
        const response = await getBookmarkedResources()
        if (response.success && response.data.resources) {
          const mappedResources = response.data.resources.map(mapBackendResourceToFrontend)
          setSavedResources(mappedResources)
        }
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'Saved', action: 'fetchBookmarkedResources' },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarkedResources()
  }, [user, navigate, handleError])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Saved Resources
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Access your saved resources from dashboard
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner showText />
          </div>
        ) : savedResources.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              {savedResources.length} saved resource{savedResources.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No saved resources yet</p>
            <Link to="/resources" className="text-black dark:text-white hover:underline text-sm">
              Browse Resources →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
