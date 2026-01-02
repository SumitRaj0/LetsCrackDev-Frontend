import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { getPurchases, getPurchaseAccess, type Purchase } from '@/lib/api/purchases.api'
import { useErrorHandler } from '@/contexts/ErrorContext'

interface AccessInfo {
  hasAccess: boolean
  accessLink?: string
  fileType?: string
  accessGrantedAt?: string
  accessExpiresAt?: string
  serviceName?: string
}

export default function PurchasedDocuments() {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [accessInfo, setAccessInfo] = useState<Record<string, AccessInfo>>({})
  const [loadingAccess, setLoadingAccess] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      setIsLoading(true)
      const response = await getPurchases({
        status: 'completed',
        purchaseType: 'service',
      })
      if (response.success) {
        setPurchases(response.data.purchases)
        // Fetch access info for each purchase
        response.data.purchases.forEach((purchase) => {
          fetchAccessInfo(purchase._id)
        })
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'PurchasedDocuments', action: 'fetchPurchases' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAccessInfo = async (purchaseId: string) => {
    try {
      setLoadingAccess((prev) => ({ ...prev, [purchaseId]: true }))
      const response = await getPurchaseAccess(purchaseId)
      if (response.success) {
        setAccessInfo((prev) => ({
          ...prev,
          [purchaseId]: response.data.access,
        }))
      }
    } catch (error) {
      // Don't show error for individual access fetches
      console.log('Access info not available for purchase:', purchaseId)
    } finally {
      setLoadingAccess((prev) => ({ ...prev, [purchaseId]: false }))
    }
  }

  const handleAccessClick = (link: string) => {
    window.open(link, '_blank')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isAccessExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen">
      <PageHero title="My Documents" description="Access your purchased interview sheets and documents" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner showText />
          </div>
        ) : purchases.length === 0 ? (
          <EmptyState
            title="No Documents Yet"
            description="You haven't purchased any documents yet. Browse our premium services to get started!"
            action={{
              label: 'Browse Services',
              onClick: () => navigate('/premium'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => {
              const access = accessInfo[purchase._id]
              const serviceName = purchase.serviceId?.name || 'Service'
              const isLoading = loadingAccess[purchase._id]
              const hasAccess = access?.hasAccess && access?.accessLink
              const isExpired = access?.accessExpiresAt ? isAccessExpired(access.accessExpiresAt) : false

              return (
                <Card key={purchase._id} className="p-6 hover:shadow-md transition-shadow duration-150 group">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {serviceName}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                          Purchased
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <strong>Amount:</strong> ₹{purchase.amount.toFixed(0)}
                        </div>
                        <div>
                          <strong>Purchased:</strong> {formatDate(purchase.completedAt)}
                        </div>
                        {access?.accessExpiresAt && (
                          <div>
                            <strong>Expires:</strong>{' '}
                            <span className={isExpired ? 'text-red-600 dark:text-red-400' : ''}>
                              {formatDate(access.accessExpiresAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {/* Check if this is an interview kit */}
                      {purchase.serviceId?.slug === 'javascript-interview-mastery-kit' ? (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => navigate(`/interview-kit/${purchase.serviceId?._id}`)}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          Access Interview Kit
                        </Button>
                      ) : isLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <LoadingSpinner size="sm" />
                        </div>
                      ) : hasAccess && !isExpired ? (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleAccessClick(access.accessLink!)}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Open Document
                        </Button>
                      ) : isExpired ? (
                        <div className="text-center">
                          <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                            Access Expired
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/premium')}
                          >
                            Purchase Again
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Access link being prepared...
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchAccessInfo(purchase._id)}
                          >
                            Refresh
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



