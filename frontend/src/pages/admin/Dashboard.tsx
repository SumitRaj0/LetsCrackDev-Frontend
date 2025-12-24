import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminAnalytics } from '@/lib/api/admin.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import type { AdminAnalytics } from '@/lib/api/admin.api'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showError } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getAdminAnalytics()
        setAnalytics(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics'
        setError(errorMessage)
        showError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [showError])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <LoadingSpinner size="lg" showText />
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Error Loading Analytics</h2>
            <p className="text-red-600 dark:text-red-300">{error || 'Failed to load dashboard data'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { overview, recentActivity } = analytics

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
              {overview.totalResources}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Resources</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              +{recentActivity.newResourcesLast30Days} this month
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {overview.totalServices}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Services</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {overview.totalUsers}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Users</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {overview.totalPremiumUsers} premium • +{recentActivity.newUsersLast30Days} this month
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {overview.totalCourses}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Courses</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              +{recentActivity.newCoursesLast30Days} this month
            </div>
          </div>
        </div>

        {/* Revenue & Purchases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              ₹{overview.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Revenue</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              ₹{recentActivity.revenueLast30Days.toLocaleString('en-IN')} this month
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="text-3xl font-bold text-black dark:text-white mb-1">
              {overview.completedPurchases}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completed Purchases</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              +{recentActivity.newPurchasesLast30Days} this month
            </div>
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
