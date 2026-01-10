/**
 * Resource Card Skeleton (Shimmer UI)
 * Loading placeholder that matches ResourceCard layout
 */

export function ResourceCardSkeleton() {
  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      {/* Category Badge and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
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

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
      </div>

      {/* Saved Count and View Details */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
        </div>
      </div>

    </div>
  )
}
