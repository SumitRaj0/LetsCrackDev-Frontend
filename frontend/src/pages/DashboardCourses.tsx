import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Dummy courses data
const enrolledCourses = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    progress: 65,
    thumbnail: '📚',
    instructor: 'Jane Smith',
    duration: '8 hours',
    modules: 12,
  },
  {
    id: '2',
    title: 'Node.js Mastery',
    progress: 30,
    thumbnail: '🚀',
    instructor: 'Mike Johnson',
    duration: '10 hours',
    modules: 15,
  },
]

export default function DashboardCourses() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">My Courses</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue learning from where you left off
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{course.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-black dark:text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{course.duration}</span>
                      <span>{course.modules} modules</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-black dark:bg-white h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => navigate(`/courses/${course.id}/view`)}
                  className="w-full"
                  size="md"
                >
                  Continue Course
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No enrolled courses yet</p>
            <Link to="/courses" className="text-black dark:text-white hover:underline text-sm">
              Browse Courses →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
