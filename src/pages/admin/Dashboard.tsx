import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  // Dummy admin stats
  const stats = {
    totalResources: 156,
    totalCategories: 8,
    totalUsers: 1240,
    totalCourses: 12,
    pendingResources: 3,
    activeUsers: 1180,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage platform content and users</p>
            </div>
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              View Homepage →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {stats.totalResources}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Resources</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {stats.pendingResources} pending
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {stats.totalCategories}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Categories</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {stats.activeUsers} active
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {stats.totalCourses}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Courses</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/admin/resources"
              className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                Manage Resources
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or delete resources
              </p>
            </Link>

            <Link
              to="/admin/categories"
              className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                Manage Categories
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organize content categories
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage user accounts
              </p>
            </Link>

            <Link
              to="/admin/courses"
              className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                Manage Courses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage premium courses</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
