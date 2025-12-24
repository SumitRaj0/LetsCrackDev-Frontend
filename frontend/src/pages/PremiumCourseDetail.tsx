import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCourseById, enrollInCourse } from '@/lib/api'
import { Course } from '@/lib/api/courses.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'
import { useUser } from '@/contexts/UserContext'

export default function PremiumCourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const { handleError } = useErrorHandler()
  const { showSuccess } = useToast()
  const { user } = useUser()

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getCourseById(id)
        if (response.success && response.data) {
          setCourse(response.data.course)
        } else {
          throw new Error('Course not found')
        }
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'PremiumCourseDetail', action: 'fetchCourse' },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [id, handleError])

  const getLevelColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getTotalDuration = (course: Course): string => {
    if (!course.lessons || !Array.isArray(course.lessons) || course.lessons.length === 0) {
      return 'Coming Soon'
    }
    const totalMinutes = course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (!id) return

    try {
      setIsEnrolling(true)
      const response = await enrollInCourse(id)
      if (response.success) {
        setIsEnrolled(true)
        showSuccess('Successfully enrolled in course!')
        navigate(`/courses/${id}/view`)
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'PremiumCourseDetail', action: 'handleEnroll' },
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/premium')}>Back to Premium</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Premium
          </Button>

          <div className="max-w-3xl">
            <div className="mb-4">
              <Badge className={getLevelColor(course.difficulty)}>
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{getTotalDuration(course)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{course.lessons?.length || 0} Lessons</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{course.price}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400">one-time payment</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {course.price === 0 || isEnrolled ? (
                <>
                  {isEnrolled ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate(`/courses/${course._id}/view`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    navigate(`/premium/checkout?type=course&id=${course._id}&price=${course.price}`)
                  }
                >
                  Pay Now - ₹{course.price}
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => navigate('/premium')}>
                Back to Courses
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Category */}
          {course.category && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Category</h3>
              <Badge variant="default">{course.category}</Badge>
            </div>
          )}

          {/* Course Details */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What You'll Learn</h2>
            <ul className="space-y-3">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{lesson.title}</span>
                      {lesson.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700 dark:text-gray-300">
                      Master core concepts and fundamentals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700 dark:text-gray-300">Build real-world projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700 dark:text-gray-300">
                      Learn best practices and patterns
                    </span>
                  </li>
                </>
              )}
            </ul>
          </Card>

          {/* CTA */}
          <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enroll in this course and get access to all premium features.
            </p>
            {course.price === 0 || isEnrolled ? (
              <>
                {isEnrolled ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(`/courses/${course._id}/view`)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  navigate(`/premium/checkout?type=course&id=${course._id}&price=${course.price}`)
                }
              >
                Pay Now - ₹{course.price}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
