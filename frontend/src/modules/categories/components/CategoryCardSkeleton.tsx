/**
 * Category Card Skeleton (Shimmer UI)
 * Loading placeholder that matches CategoryCard layout exactly
 */

export function CategoryCardSkeleton() {
  return (
    <div className="block h-full cursor-wait">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 h-full overflow-hidden">
        <div className="flex flex-col gap-4">
          {/* Icon placeholder */}
          <div className="text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <div className="w-6 h-6 bg-indigo-200 dark:bg-indigo-800/50 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
            </div>
          </div>
          
          {/* Title and description */}
          <div className="min-w-0 space-y-3">
            {/* Title */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-3/4">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
            </div>
            
            {/* Description/Resource count */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-2/3">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
