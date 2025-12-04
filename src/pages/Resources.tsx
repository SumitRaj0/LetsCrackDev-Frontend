import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { allResources } from '@/modules/resources/data/allResources'
import { categories } from '@/modules/categories/data/categories'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/button'

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

  // Initialize search query from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = [...allResources]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.categorySlug === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(r => r.tags.includes(selectedDifficulty))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'popular':
          return b.savedCount - a.savedCount
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, selectedDifficulty, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE)
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredResources, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
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
        {filteredResources.length > 0 ? (
          <>
            <div className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ResourceCard resource={resource} />
                </div>
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
