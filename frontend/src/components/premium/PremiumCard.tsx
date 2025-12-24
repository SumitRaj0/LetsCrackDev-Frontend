import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PremiumCourse } from '@/data/premiumCourses'
import type { PremiumService } from '@/data/premiumServices'

interface PremiumCardProps {
  item: PremiumCourse | PremiumService
  type: 'course' | 'service'
}

export function PremiumCard({ item, type }: PremiumCardProps) {
  const isCourse = type === 'course'
  const course = isCourse ? (item as PremiumCourse) : null
  const service = !isCourse ? (item as PremiumService) : null

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Career':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'AI Tools':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'Templates':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Card className="p-6 hover-lift h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          {course && <Badge className={getLevelColor(course.level)}>{course.level}</Badge>}

          {service && (
            <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
          )}

          {/* Enrollment/Opted Count Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            <svg
              className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {course
                ? formatCount(course.enrolledCount)
                : service
                  ? formatCount(service.optedCount)
                  : '0'}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>

        {course && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{course.duration}</span>
            </div>
            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {service && service.features.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <svg
                    className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{item.price}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">one-time</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Link to={isCourse ? `/premium/course/${item.id}` : `/premium/service/${item.id}`}>
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}
