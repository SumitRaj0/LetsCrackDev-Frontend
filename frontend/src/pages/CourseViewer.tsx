import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCourseById, getCourseEnrollment, updateCourseProgress, type Course, type Lesson } from '@/lib/api/courses.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
  const [notes, setNotes] = useState('')
  const [comments, setComments] = useState([
    { id: '1', user: 'John Doe', text: 'Great explanation!', time: '2 hours ago' },
    { id: '2', user: 'Sarah Chen', text: 'This pattern is really useful.', time: '1 day ago' },
  ])
  const [newComment, setNewComment] = useState('')
  const { handleError } = useErrorHandler()
  const { showSuccess } = useToast()

  // Fetch course data and enrollment
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        // Fetch course
        const courseResponse = await getCourseById(id)
        if (courseResponse.success && courseResponse.data.course) {
          setCourse(courseResponse.data.course)
        } else {
          throw new Error('Course not found')
        }

        // Fetch user's enrollment data
        try {
          const enrollmentResponse = await getCourseEnrollment(id)
          if (enrollmentResponse.success && enrollmentResponse.data.isEnrolled && enrollmentResponse.data.enrollment) {
            const enrollment = enrollmentResponse.data.enrollment
            setProgress(enrollment.progress)
            // Map completed lesson indices to lesson titles
            // completedLessons from backend are stored as indices (0-based)
            if (courseResponse.data.course.lessons && enrollment.completedLessons.length > 0) {
              const completedTitles = enrollment.completedLessons
                .map((index: string | number) => {
                  const idx = typeof index === 'string' ? parseInt(index, 10) : index
                  return courseResponse.data.course.lessons?.[idx]?.title
                })
                .filter(Boolean) as string[]
              setCompletedLessons(completedTitles)
            }
          }
        } catch (enrollmentError) {
          // User might not be enrolled yet, that's okay
          console.log('No enrollment found or error fetching enrollment:', enrollmentError)
        }
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'CourseViewer', action: 'fetchCourseData' },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [id, handleError])

  // Update progress when completed lessons change
  useEffect(() => {
    if (course?.lessons && course.lessons.length > 0) {
      const newProgress = (completedLessons.length / course.lessons.length) * 100
      setProgress(newProgress)
    }
  }, [completedLessons, course])

  const currentLesson = course?.lessons?.[currentLessonIndex]

  const handleNextLesson = () => {
    if (course?.lessons && currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const handleMarkComplete = async () => {
    if (!id || !currentLesson || !course.lessons) return

    const lessonIndex = currentLessonIndex
    const lessonTitle = currentLesson.title
    const isCompleted = completedLessons.includes(lessonTitle)

    try {
      setIsUpdatingProgress(true)
      const newCompletedLessons = isCompleted
        ? completedLessons.filter(title => title !== lessonTitle)
        : [...completedLessons, lessonTitle]

      // Convert lesson titles to indices for backend
      const completedIndices = course.lessons
        .map((lesson, index) => (newCompletedLessons.includes(lesson.title) ? index : -1))
        .filter(index => index !== -1)

      const newProgress = course.lessons
        ? Math.round((newCompletedLessons.length / course.lessons.length) * 100)
        : 0

      const response = await updateCourseProgress(id, {
        progress: newProgress,
        completedLessons: completedIndices.map(String), // Send as string array
      })

      if (response.success) {
        setCompletedLessons(newCompletedLessons)
        setProgress(newProgress)
        showSuccess(isCompleted ? 'Lesson marked as incomplete' : 'Lesson completed!')
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'CourseViewer', action: 'handleMarkComplete' },
      })
    } finally {
      setIsUpdatingProgress(false)
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        { id: Date.now().toString(), user: 'You', text: newComment, time: 'Just now' },
        ...comments,
      ])
      setNewComment('')
    }
  }

  if (isLoading) {
    return (
      <LoadingSpinner fullScreen showText />
    )
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course or Lesson Not Found
          </h1>
          <Button onClick={() => navigate('/dashboard/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  const isLessonCompleted = currentLesson.title && completedLessons.includes(currentLesson.title)
  const lessonDuration = currentLesson.duration
    ? `${Math.floor(currentLesson.duration / 60)}:${String(currentLesson.duration % 60).padStart(2, '0')}`
    : 'N/A'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/courses')}
              size="sm"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Return to My Courses
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg">Video Player</p>
                <p className="text-sm text-gray-400 mt-2">{currentLesson.title}</p>
                {currentLesson.videoUrl && (
                  <a
                    href={currentLesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                  >
                    Open Video
                  </a>
                )}
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {currentLesson.title}
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">{lessonDuration}</span>
              </div>
              {currentLesson.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{currentLesson.description}</p>
              )}
              <div className="flex items-center gap-4">
                <Button
                  variant={isLessonCompleted ? 'primary' : 'outline'}
                  onClick={handleMarkComplete}
                  size="md"
                  disabled={isUpdatingProgress}
                >
                  {isUpdatingProgress
                    ? 'Updating...'
                    : isLessonCompleted
                      ? '✓ Completed'
                      : 'Mark Complete'}
                </Button>
                {course.lessons && currentLessonIndex < course.lessons.length - 1 && (
                  <Button variant="primary" onClick={handleNextLesson} size="md">
                    Next Lesson →
                  </Button>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">My Notes</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
              />
              <Button variant="outline" onClick={() => setNotes('')} size="sm" className="mt-3">
                Clear Notes
              </Button>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Comments</h3>
              <div className="space-y-4 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-black dark:text-white text-sm">
                        {comment.user}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1"
                  rounded="default"
                />
                <Button variant="primary" onClick={handleAddComment} size="md">
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                {course.title}
              </h3>
              <div className="space-y-2">
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, index) => {
                    const isCompleted = lesson.title && completedLessons.includes(lesson.title)
                    const lessonDuration = lesson.duration
                      ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}`
                      : 'N/A'

                    return (
                      <Button
                        key={index}
                        variant={index === currentLessonIndex ? 'primary' : 'ghost'}
                        onClick={() => setCurrentLessonIndex(index)}
                        className="w-full text-left justify-start"
                        size="md"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span className="text-sm font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-xs opacity-70">{lessonDuration}</span>
                        </div>
                      </Button>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No lessons available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
