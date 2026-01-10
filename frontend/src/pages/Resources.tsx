import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { ResourceCardSkeleton } from '@/modules/resources/components/ResourceCardSkeleton'
import { categories } from '@/modules/categories/data/categories'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/button'
import { getResources } from '@/lib/api'
import { mapBackendResourceToFrontend } from '@/lib/api/resourceMapper'
import { Resource } from '@/modules/resources/types'
import { useErrorHandler } from '@/contexts/ErrorContext'

type SortOption = 'newest' | 'rating' | 'popular'
type DifficultyFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced'

const ITEMS_PER_PAGE = 12

interface FilterSelectOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterSelectOption[]
  className?: string
}

function FilterSelect({ value, onChange, options, className = '' }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selected = options.find(opt => opt.value === value) ?? options[0]

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center justify-between gap-2 px-4 py-2 pr-9 rounded-xl border border-indigo-200/70 dark:border-indigo-700/70 
                   bg-white/80 dark:bg-gray-900/70 text-sm font-medium text-gray-900 dark:text-white
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-colors w-auto min-w-[150px]"
      >
        <span className="truncate">{selected.label}</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute z-30 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-indigo-200/80 dark:border-indigo-700/80 
                     bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm"
        >
          {options.map(opt => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors
                           ${
                             isSelected
                               ? 'bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 font-semibold'
                               : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/70'
                           }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <span className="ml-2 text-[11px] uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                    Selected
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  )
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const { handleError } = useErrorHandler()
  const abortControllerRef = useRef<AbortController | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const fetchResourcesRef = useRef<(() => Promise<void>) | null>(null)

  // Initialize search query from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  // Sync category from URL params when they change
  useEffect(() => {
    const urlCategory = searchParams.get('category')
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory)
    } else if (!urlCategory && selectedCategory !== 'all') {
      setSelectedCategory('all')
    }
  }, [searchParams, selectedCategory])

  // Memoize handleError to prevent unnecessary re-renders
  const stableHandleError = useCallback(
    (error: unknown, options?: Parameters<typeof handleError>[1]) => {
      handleError(error, options)
    },
    [handleError]
  )

  // Fetch resources from API with request cancellation
  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const fetchResources = async (forceRefresh = false) => {
      // Skip if recently fetched (unless forced)
      const now = Date.now()
      if (!forceRefresh && now - lastFetchTimeRef.current < 2000) {
        // Don't fetch if we fetched less than 2 seconds ago (unless forced)
        return
      }
      lastFetchTimeRef.current = now

      try {
        setIsLoading(true)
        
        // Map difficulty filter to backend format
        const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced' | undefined> = {
          'Beginner': 'beginner',
          'Intermediate': 'intermediate',
          'Advanced': 'advanced',
        }
        
        const response = await getResources({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? difficultyMap[selectedDifficulty] : undefined,
          search: searchQuery.trim() || undefined,
        })

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return
        }

        // Validate response structure
        if (!response || !response.data || !Array.isArray(response.data.resources)) {
          throw new Error('Invalid response structure from API')
        }

        // Map backend resources to frontend format
        let mappedResources: Resource[] = []
        try {
          mappedResources = response.data.resources.map((resource: any) => {
            try {
              return mapBackendResourceToFrontend(resource)
            } catch {
              return null
            }
          }).filter((r: Resource | null): r is Resource => r !== null)
        } catch (mappingError) {
          throw new Error(`Failed to map resources: ${mappingError}`)
        }
        
        // Sort resources (backend already sorts by newest, but we can sort client-side for rating/popular)
        let sortedResources = [...mappedResources]
        if (sortBy === 'rating') {
          sortedResources.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'popular') {
          sortedResources.sort((a, b) => b.savedCount - a.savedCount)
        }
        
        setResources(sortedResources)
        setTotalPages(response.data.pagination.totalPages)
      } catch (error: any) {
        // Ignore abort errors
        if (error?.name === 'AbortError' || abortController.signal.aborted) {
          return
        }
        
        stableHandleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'Resources', action: 'fetchResources' },
        })
        setResources([])
      } finally {
        // Only update loading state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    // Store fetchResources function reference for use in other effects
    fetchResourcesRef.current = () => fetchResources(true)

    // Debounce search queries to avoid too many requests
    if (searchQuery.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchResources()
      }, 300) // 300ms debounce for search
    } else {
      fetchResources()
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      abortController.abort()
    }
  }, [currentPage, selectedCategory, selectedDifficulty, searchQuery, sortBy, stableHandleError])

  // Auto-refresh when page becomes visible (user switches back from admin tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && fetchResourcesRef.current) {
        fetchResourcesRef.current()
      }
    }

    const handleFocus = () => {
      if (fetchResourcesRef.current) {
        fetchResourcesRef.current()
      }
    }

    // Listen to visibility changes (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Listen to window focus (switching between windows/apps)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Filter and sort resources (client-side for additional sorting)
  const filteredResources = useMemo(() => {
    return resources
  }, [resources])

  // Pagination - resources are already paginated from backend
  const paginatedResources = filteredResources

  // Reset to page 1 when filters change (but not on initial mount)
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    setCurrentPage(1)
  }, [selectedCategory, selectedDifficulty, searchQuery, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  // Get active filters
  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; value: string; onRemove: () => void }> = []
    
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
      filters.push({
        key: 'category',
        label: 'Category',
        value: categoryName,
        onRemove: () => {
          setSelectedCategory('all')
          setSearchParams({})
        },
      })
    }
    
    if (selectedDifficulty !== 'all') {
      filters.push({
        key: 'difficulty',
        label: 'Difficulty',
        value: selectedDifficulty,
        onRemove: () => setSelectedDifficulty('all'),
      })
    }
    
    if (searchQuery.trim()) {
      filters.push({
        key: 'search',
        label: 'Search',
        value: searchQuery,
        onRemove: () => {
          setSearchQuery('')
          const newParams = new URLSearchParams(searchParams)
          newParams.delete('search')
          setSearchParams(newParams)
        },
      })
    }
    
    if (sortBy !== 'newest') {
      const sortLabels: Record<SortOption, string> = {
        newest: 'Newest',
        rating: 'Highest Rated',
        popular: 'Most Popular',
      }
      filters.push({
        key: 'sort',
        label: 'Sort',
        value: sortLabels[sortBy],
        onRemove: () => setSortBy('newest'),
      })
    }
    
    return filters
  }, [selectedCategory, selectedDifficulty, searchQuery, sortBy, searchParams, setSearchParams])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Free Resources
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Discover and explore thousands of curated developer resources
            </p>

            {/* Search */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search resources..."
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <span>Filters</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
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
            </Button>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span>
                  {activeFilters.map(filter => (
                    <div
                      key={filter.key}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                    >
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">{filter.label}:</span>
                      <span>{filter.value}</span>
                      <button
                        type="button"
                        onClick={filter.onRemove}
                        className="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${filter.label} filter`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedDifficulty('all')
                      setSortBy('newest')
                      setSearchQuery('')
                      setSearchParams({})
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in">
                {/* Category Select */}
                <FilterSelect
                  value={selectedCategory}
                  onChange={val => handleCategoryChange(val)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat.slug, label: cat.name })),
                  ]}
                  className="min-w-[180px]"
                />

                {/* Difficulty Select */}
                <FilterSelect
                  value={selectedDifficulty}
                  onChange={val => setSelectedDifficulty(val as DifficultyFilter)}
                  options={[
                    { value: 'all', label: 'All Levels' },
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                  className="min-w-[150px]"
                />

                {/* Sort Select */}
                <FilterSelect
                  value={sortBy}
                  onChange={val => setSortBy(val as SortOption)}
                  options={[
                    { value: 'newest', label: 'Newest' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'popular', label: 'Most Popular' },
                  ]}
                  className="min-w-[150px]"
                />

                {/* Clear Filters Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                    setSortBy('newest')
                    setSearchQuery('')
                    setSearchParams({})
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(12)].map((_, index) => (
              <ResourceCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <>
            <div className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              {paginatedResources.length} resource{paginatedResources.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No Resources Found"
            description="Try adjusting your filters or search query."
            action={{
              label: 'Clear Filters',
              onClick: () => {
                setSelectedCategory('all')
                setSelectedDifficulty('all')
                setSearchQuery('')
                setSearchParams({})
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
