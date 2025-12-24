import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { deleteCourse, getCourses, type Course } from '@/lib/api/courses.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'

export default function AdminCourses() {
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await getCourses({
          page: 1,
          limit: 100, // Get all for admin
        })
        if (response.success && response.data.courses) {
          setCourses(response.data.courses)
        }
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'AdminCourses', action: 'fetchCourses' },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [handleError])

  const filteredCourses = useMemo(() => {
    let filtered = [...courses]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      )
    }

    // Note: Courses don't have a status field in the API, so statusFilter is ignored
    // This could be implemented if status is added to the course model

    return filtered
  }, [searchQuery, statusFilter])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return

    try {
      await deleteCourse(id)
      showSuccess('Course deleted successfully')
      // Remove from local state
      setCourses(courses.filter(c => c._id !== id))
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminCourses', action: 'handleDelete' },
      })
    }
  }

  const handlePublish = async (_id: string) => {
    // Publishing is not a separate API endpoint - courses are always "published"
    // This could be implemented as updating a status field if needed in the future
    showSuccess('Course is already published')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen showText />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Manage Courses</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Add, modify, or manage premium courses
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate('/admin/courses/new')} variant="primary" size="md">
              Add New Course
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 19L14.65 14.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  rounded="full"
                  className="pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Courses Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => {
                    const totalMinutes = course.lessons
                      ? course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)
                      : 0
                    const duration = totalMinutes > 0
                      ? `${Math.floor(totalMinutes / 60)}h`
                      : 'N/A'
                    const modules = course.lessons?.length || 0

                    return (
                      <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black dark:text-white">
                            {course.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {modules} modules
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {course.createdBy?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{duration}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-black dark:text-white">
                            ₹{course.price}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700 dark:text-gray-300">-</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success" size="sm">
                            Published
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                              size="sm"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handlePublish(course._id)}
                              size="sm"
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            >
                              Publish
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(course._id)}
                              size="sm"
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>
    </div>
  )
}
