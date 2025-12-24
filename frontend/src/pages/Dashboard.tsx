import { Link } from 'react-router-dom'
import { allResources } from '@/modules/resources/data/allResources'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { dummyUser } from '@/lib/dummyUser'
import { useUser } from '@/hooks/useUser'

// Dummy courses data
const ongoingCourses = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    progress: 65,
    thumbnail: '📚',
    instructor: 'Jane Smith',
  },
  {
    id: '2',
    title: 'Node.js Mastery',
    progress: 30,
    thumbnail: '🚀',
    instructor: 'Mike Johnson',
  },
]

export default function Dashboard() {
  const { user } = useUser()
  const profileUser = user
    ? {
        ...dummyUser,
        id: user.sub || dummyUser.id,
        name: user.name || dummyUser.name,
        email: user.email || dummyUser.email,
      }
    : dummyUser

  const savedResources = allResources.filter(r => profileUser.savedResources.includes(r.id))
  const recentResources = allResources.filter(r => profileUser.recentlyViewed.includes(r.id))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Welcome back, {profileUser.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
            </div>
            <Link
              to="/dashboard/profile"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              My Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {savedResources.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Saved Resources</div>
            <Link
              to="/dashboard/saved"
              className="text-sm text-black dark:text-white hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {ongoingCourses.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Enrolled Courses</div>
            <Link
              to="/dashboard/courses"
              className="text-sm text-black dark:text-white hover:underline"
            >
              View all →
            </Link>
          </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {profileUser.learningHours}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Learning Hours</div>
            <Link
              to="/dashboard/profile"
              className="text-sm text-black dark:text-white hover:underline"
            >
              View profile →
            </Link>
          </div>
        </div>

        {/* Ongoing Courses */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">Ongoing Courses</h2>
            <Link
              to="/dashboard/courses"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              View all →
            </Link>
          </div>
          {ongoingCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingCourses.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}/view`}
                  className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black dark:text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        by {course.instructor}
                      </p>
                      <div className="mb-2">
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
                      <span className="text-sm text-black dark:text-white hover:underline">
                        Continue Course →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No ongoing courses</p>
              <Link to="/courses" className="text-black dark:text-white hover:underline text-sm">
                Browse Courses →
              </Link>
            </div>
          )}
        </div>

        {/* Recently Viewed Resources */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">Recently Viewed</h2>
            <Link
              to="/resources"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              View all →
            </Link>
          </div>
          {recentResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No recently viewed resources</p>
              <Link to="/resources" className="text-black dark:text-white hover:underline text-sm">
                Browse Resources →
              </Link>
            </div>
          )}
        </div>

        {/* Saved Resources */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">Saved Resources</h2>
            <Link
              to="/dashboard/saved"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              View all →
            </Link>
          </div>
          {savedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No saved resources yet</p>
              <Link to="/resources" className="text-black dark:text-white hover:underline text-sm">
                Browse Resources →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
