import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { allResources } from '@/modules/resources/data/allResources'
import { ResourceCard } from '@/modules/resources/components/ResourceCard'
import { dummyUser } from '@/lib/dummyUser'
import { useUser } from '@/hooks/useUser'
import { getPurchases, type Purchase } from '@/lib/api/purchases.api'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { handleError } = useErrorHandler()
  const [purchasedServices, setPurchasedServices] = useState<Purchase[]>([])
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true)
  
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

  useEffect(() => {
    // Only fetch if user is authenticated
    if (user) {
      fetchPurchasedServices()
    }
  }, [user])

  const fetchPurchasedServices = async () => {
    try {
      setIsLoadingPurchases(true)
      const response = await getPurchases({
        status: 'completed',
        purchaseType: 'service',
      })
      if (response.success) {
        setPurchasedServices(response.data.purchases)
      }
    } catch (error) {
      handleError(error, {
        showToast: false,
        logError: true,
        context: { component: 'Dashboard', action: 'fetchPurchasedServices' },
      })
    } finally {
      setIsLoadingPurchases(false)
    }
  }

  // Filter interview kits from purchased services
  const interviewKits = purchasedServices.filter(
    (purchase) => purchase.serviceId?.slug === 'javascript-interview-mastery-kit'
  )

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
              {interviewKits.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Preparation Kits</div>
            <Link
              to="/dashboard/documents"
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

        {/* My Preparation Kits */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">My Preparation Kits</h2>
            <Link
              to="/dashboard/documents"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              View all →
            </Link>
          </div>
          {isLoadingPurchases ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="sm" />
            </div>
          ) : interviewKits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewKits.map((purchase) => {
                const serviceName = purchase.serviceId?.name || 'Interview Kit'
                const serviceId = purchase.serviceId?._id || ''
                return (
                  <Card key={purchase._id} className="p-6 hover:shadow-md transition-shadow duration-150 group">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">📚</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {serviceName}
                          </h3>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                            Purchased
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          50 curated JavaScript interview questions with structured answers
                        </p>
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => navigate(`/interview-kit/${serviceId}`)}
                        >
                          Access Interview Kit →
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No preparation kits yet</p>
              <Link to="/premium" className="text-black dark:text-white hover:underline text-sm">
                Browse Premium Services →
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
