/**
 * Resource Card Skeleton (Shimmer UI)
 * Loading placeholder that matches ResourceCard layout exactly
 */

export function ResourceCardSkeleton() {
  return (
    <div className="group block h-full cursor-wait">
      <div className="h-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden">
        {/* Category Badge and Rating */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          {/* Category Badge - matches the indigo badge style */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full relative overflow-hidden">
            <div className="h-4 w-4 bg-indigo-200 dark:bg-indigo-800/50 rounded"></div>
            <div className="h-3 w-16 bg-indigo-200 dark:bg-indigo-800/50 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
            </div>
          </div>
          
          {/* Rating section */}
          <div className="flex items-center gap-2">
            {/* Bookmark icon placeholder (optional) */}
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
            </div>
            {/* Star and rating */}
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
              </div>
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title - 2 lines */}
        <div className="mb-3 space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>

        {/* Description - 3 lines */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>

        {/* Tags - matches the tag style */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full h-6 w-16 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full h-6 w-20 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full h-6 w-14 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>

        {/* Saved Count and View Details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-20 bg-indigo-200 dark:bg-indigo-800/50 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
            </div>
            <div className="h-4 w-4 bg-indigo-200 dark:bg-indigo-800/50 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
