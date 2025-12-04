import { Link, useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/shared/SearchBar'
import { CategoryCard } from '@/modules/categories/components/CategoryCard'
import { categories } from '@/modules/categories/data/categories'
import { popularResources } from '@/modules/resources/data/popularResources'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { ReviewCard } from '@/components/shared/ReviewCard'
import { reviews } from '@/data/reviews'
import { ArrowRightIcon } from '@/components/ui/icons/ArrowRightIcon'
import { FadeInOnScroll } from '@/components/shared/FadeInOnScroll'

const POPULAR_SEARCHES = ['React', 'Tailwind', 'System Design', 'Next.js'] as const

export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/resources?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/resources')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Background blobs - optional micro-motion */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <FadeInOnScroll>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
              Find the Best Free Developer Resources
            </h1>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100}>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              A community-driven hub to discover, share, and track tools, libraries, and learning
              materials.
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200}>
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={300}>
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto">
              <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Popular:</span>
              {POPULAR_SEARCHES.map(search => (
                <Link
                  key={search}
                  to={`/resources?search=${search}`}
                  className="px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  {search}
                </Link>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Categories Section (kept small for performance) */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <FadeInOnScroll>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                Explore Categories
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Browse resources by specific technology or domain.
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
            >
              <span>View all categories</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <FadeInOnScroll key={category.id} delay={index * 50}>
              <CategoryCard category={category} />
            </FadeInOnScroll>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
          >
            <span>View all categories</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </section>

      {/* Top Picks for You Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Top Picks for You
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Handpicked resources loved by the community
                </p>
              </div>
              <Link
                to="/resources"
                className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
              >
                <span>View all resources</span>
                <ArrowRightIcon />
              </Link>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularResources.slice(0, 6).map((resource, index) => (
              <FadeInOnScroll key={resource.id} delay={index * 50}>
                <ResourceCard resource={resource} />
              </FadeInOnScroll>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              <span>View all resources</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section - Carousel */}
      <section className="py-12 md:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                What Our Community Says
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Real stories from developers who've grown with LetsCrackDev
              </p>
            </div>
          </FadeInOnScroll>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden mask-gradient">
              <div className="flex gap-6 animate-scroll-left" style={{ width: 'max-content' }}>
                {/* First set of reviews */}
                {reviews.map(review => (
                  <div key={`first-${review.id}`} className="flex-shrink-0 w-[350px]">
                    <ReviewCard review={review} />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {reviews.map(review => (
                  <div key={`second-${review.id}`} className="flex-shrink-0 w-[350px]">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
