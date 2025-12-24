import { Card } from '@/components/ui/card'
import type { Review } from '@/data/reviews'
import { formatDate } from '@/utils/dateFormat'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="p-6 hover-lift h-full flex flex-col min-h-[280px]">
      <div className="flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">{renderStars(review.rating)}</div>

        {/* Review Text */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed line-clamp-4">
          "{review.comment}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {review.avatar || getInitials(review.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {review.name}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {review.role} at {review.company}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {formatDate(review.date)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
