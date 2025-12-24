import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { getCourses } from '@/lib/api'
import { Course } from '@/lib/api/courses.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useErrorHandler } from '@/contexts/ErrorContext'

export default function Courses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { handleError } = useErrorHandler()

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await getCourses({
          page: currentPage,
          limit: 12,
        })
        setCourses(response.data.courses)
        setTotalPages(response.data.pagination.totalPages)
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'Courses', action: 'fetchCourses' },
        })
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [currentPage, handleError])

  // Calculate total duration from lessons
  const getTotalDuration = (course: Course): string => {
    if (!course.lessons || !Array.isArray(course.lessons) || course.lessons.length === 0) {
      return '0m'
    }
    const totalMinutes = course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Map difficulty to level format
  const mapDifficultyToLevel = (difficulty: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const map: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    }
    return map[difficulty] || 'Beginner'
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="All Courses"
        description="Explore our comprehensive collection of courses to level up your development skills"
      />

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map(course => (
                <PremiumCard
                  key={course._id}
                  item={{
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    level: mapDifficultyToLevel(course.difficulty),
                    duration: getTotalDuration(course),
                    isPremium: course.isPremium,
                    tags: [course.category],
                    enrolledCount: 0, // Backend doesn't have this
                    price: course.price,
                  }}
                  type="course"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? 'primary' : 'outline'}
                        size="sm"
                      >
                        {page}
                      </Button>
                    )
                  })}
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
            title="No Courses Found"
            description="There are no courses available at the moment."
            action={{
              label: 'Go Home',
              onClick: () => navigate('/'),
            }}
          />
        )}
      </div>
    </div>
  )
}
