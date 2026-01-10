/**
 * Premium Card Skeleton (Shimmer UI)
 * Loading placeholder that matches PremiumCard layout exactly
 */

export function PremiumCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-150 h-full flex flex-col overflow-hidden">
      <div className="flex-1">
        {/* Badge and Count */}
        <div className="flex items-center justify-between mb-3">
          {/* Badge placeholder */}
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          
          {/* Count chip placeholder */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full h-7 w-16 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-3/4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>

        {/* Description - 3 lines */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-full">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-full">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-5/6">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>

        {/* Duration/Tags or Features placeholder */}
        <div className="mb-4 space-y-2">
          {/* Duration/Tags section */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-24">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
          {/* Tags placeholder */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden w-32">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Button placeholder */}
      <div className="mt-auto pt-4">
        <div className="h-10 bg-indigo-200 dark:bg-indigo-800/50 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-700/40 to-transparent"></div>
        </div>
      </div>
    </div>
  )
}
