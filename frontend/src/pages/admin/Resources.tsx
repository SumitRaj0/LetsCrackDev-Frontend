import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteResource, getResources, updateResource } from '@/lib/api/resources.api'
import { mapBackendResourceToFrontend } from '@/lib/api/resourceMapper'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'

export default function AdminResources() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [resources, setResources] = useState<ReturnType<typeof mapBackendResourceToFrontend>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      setIsLoading(true)
      console.log('[AdminResources] Fetching resources...')
      const response = await getResources({
        page: 1,
        limit: 100, // Get all for admin
      })
      console.log('[AdminResources] API response:', response)
      console.log('[AdminResources] Response success:', response?.success)
      console.log('[AdminResources] Resources array:', response?.data?.resources)
      console.log('[AdminResources] Resources count:', response?.data?.resources?.length)
      
      if (response.success && response.data.resources) {
        console.log('[AdminResources] Mapping resources...')
        const mappedResources = response.data.resources.map(mapBackendResourceToFrontend)
        console.log('[AdminResources] Mapped resources:', mappedResources)
        console.log('[AdminResources] Mapped count:', mappedResources.length)
        setResources(mappedResources)
      } else {
        console.warn('[AdminResources] No resources in response or response not successful')
        setResources([])
      }
    } catch (error) {
      console.error('[AdminResources] Error fetching resources:', error)
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminResources', action: 'fetchResources' },
      })
      setResources([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [handleError, location.pathname]) // Refresh when pathname changes (user navigates back)

  // Filter resources
  const filteredResources = useMemo(() => {
    let filtered = [...resources]
    
    console.log('[AdminResources] Filtering resources. Total:', resources.length)
    console.log('[AdminResources] Status filter:', statusFilter)
    console.log('[AdminResources] Resources with status:', resources.map(r => ({ id: r.id, title: r.title, status: r.status })))

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      const beforeCount = filtered.length
      filtered = filtered.filter(r => {
        // Default to 'published' if status is undefined (backward compatibility)
        const resourceStatus = r.status || 'published'
        return resourceStatus === statusFilter
      })
      console.log('[AdminResources] After status filter:', filtered.length, 'from', beforeCount)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.categorySlug === categoryFilter)
    }

    console.log('[AdminResources] Final filtered count:', filtered.length)
    return filtered
  }, [searchQuery, statusFilter, categoryFilter, resources])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return

    try {
      await deleteResource(id)
      showSuccess('Resource deleted successfully')
      // Remove from local state
      setResources(resources.filter(r => r.id !== id))
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminResources', action: 'handleDelete' },
      })
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const resource = resources.find(r => r.id === id)
      if (!resource) {
        console.error('[AdminResources] Resource not found for publish/unpublish:', id)
        return
      }

      const currentStatus = resource.status || 'published' // Default to published if undefined
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      const action = newStatus === 'published' ? 'activated' : 'deactivated'

      console.log('[AdminResources] Changing resource status:', {
        id,
        title: resource.title,
        currentStatus,
        newStatus,
        action
      })

      // Update resource status
      const response = await updateResource(id, { status: newStatus })
      
      console.log('[AdminResources] Update response:', response)
      
      if (response.success && response.data.resource) {
        console.log('[AdminResources] Resource updated successfully:', {
          id: response.data.resource._id,
          title: response.data.resource.title,
          status: response.data.resource.status
        })
        showSuccess(`Resource ${action} successfully`)
        // Refresh the list immediately
        await fetchResources()
        // Force a small delay to ensure backend has processed the update
        setTimeout(() => {
          fetchResources()
        }, 500)
      } else {
        console.error('[AdminResources] Update failed:', response)
        throw new Error('Failed to update resource status')
      }
    } catch (error) {
      console.error('[AdminResources] Error in handlePublish:', error)
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminResources', action: 'handlePublish' },
      })
    }
  }

  const categories = Array.from(new Set(resources.map(r => r.categorySlug)))

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen showText />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Manage Resources
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Add, edit, or delete resources</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Back to Dashboard
              </Link>
              <Link
                to="/resources"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                View Free Resource Listing
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin/resources/new">
                <Button variant="primary" size="md">
                  Add New Resource
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="md"
                onClick={fetchResources}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 19L14.65 14.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  rounded="full"
                  className="pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                    <option value="published">Active</option>
                    <option value="draft">Unactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResources.length > 0 ? (
                  filteredResources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black dark:text-white">
                          {resource.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {resource.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {resource.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={resource.status === 'published' ? 'success' : 'default'} 
                          size="sm"
                        >
                          {resource.status === 'published' ? 'Active' : 'Unactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => navigate(`/admin/resources/${resource.id}/edit`)}
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handlePublish(resource.id)}
                            size="sm"
                            className={
                              resource.status === 'published'
                                ? 'text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300'
                                : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'
                            }
                          >
                            {resource.status === 'published' ? 'Make Unactive' : 'Make Active'}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(resource.id)}
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-500 dark:text-gray-400">
                          {isLoading ? 'Loading resources...' : 'No resources found'}
                        </p>
                        {!isLoading && resources.length === 0 && (
                          <Link to="/admin/resources/new">
                            <Button variant="primary" size="sm">
                              Create Your First Resource
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count and debug info */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
          {resources.length === 0 && !isLoading && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>No resources found.</strong> This could mean:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>No resources have been created yet</li>
                <li>The API returned an empty array</li>
                <li>Check the browser console for API response details</li>
              </ul>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Check the browser console (F12) for detailed logs about the API call.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
