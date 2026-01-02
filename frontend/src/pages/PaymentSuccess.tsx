import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getPurchaseAccess, getPurchaseById } from '@/lib/api/purchases.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const [accessLink, setAccessLink] = useState<string | null>(null)
  const [accessExpiresAt, setAccessExpiresAt] = useState<string | null>(null)
  const [isLoadingAccess, setIsLoadingAccess] = useState(false)
  const [serviceSlug, setServiceSlug] = useState<string | null>(null)
  
  const state = location.state as {
    purchaseId?: string
    amount?: number
    type?: string
    serviceId?: string
    serviceSlug?: string
  } | null

  useEffect(() => {
    // Fetch purchase details and access link if purchase is for a service
    const fetchAccess = async () => {
      if (!state?.purchaseId || state?.type !== 'service') return
      
      try {
        setIsLoadingAccess(true)
        
        // Fetch purchase details to get service slug (for interview kit detection)
        try {
          const purchaseResponse = await getPurchaseById(state.purchaseId)
          if (purchaseResponse.success && purchaseResponse.data.purchase.serviceId) {
            const service = purchaseResponse.data.purchase.serviceId as { slug?: string }
            if (service?.slug) {
              setServiceSlug(service.slug)
              
              // Only fetch access link for non-interview-kit services
              if (service.slug !== 'javascript-interview-mastery-kit') {
                try {
                  const response = await getPurchaseAccess(state.purchaseId)
                  if (response.success && response.data.access?.accessLink) {
                    setAccessLink(response.data.access.accessLink)
                    setAccessExpiresAt(response.data.access.accessExpiresAt || null)
                  }
                } catch (error) {
                  // Silently handle - access link might be generating
                  console.log('Access link not available yet')
                }
              }
            }
          }
        } catch (error) {
          // Silently fail - not critical
          console.log('Could not fetch purchase details')
        }
      } catch (error) {
        console.log('Error fetching access info')
      } finally {
        setIsLoadingAccess(false)
      }
    }

    fetchAccess()
  }, [state?.purchaseId, state?.type])

  useEffect(() => {
    // Auto-redirect after 8 seconds (smooth transition)
    const timer = setTimeout(() => {
      // If it's an interview kit, go directly to it, otherwise go to dashboard
      if (state?.type === 'service' && 
          serviceSlug === 'javascript-interview-mastery-kit' && 
          state.serviceId) {
        navigate(`/interview-kit/${state.serviceId}`)
      } else {
        navigate('/dashboard')
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [navigate, state, serviceSlug])

  return (
    <div className="min-h-screen">
      <PageHero title="Payment Successful" description="Thank you for your purchase!" />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment has been processed successfully.
            </p>
          </div>

          {state?.amount && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Paid</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{state.amount.toFixed(0)}
              </div>
            </div>
          )}

          {/* Show Interview Kit access button for JavaScript Interview Mastery Kit */}
          {state?.type === 'service' && 
           serviceSlug === 'javascript-interview-mastery-kit' && 
           state.serviceId && (
            <div className="mb-6 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Access Your Interview Kit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your JavaScript Interview Mastery Kit is ready! Access all 50 curated interview questions with structured answers.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/interview-kit/${state.serviceId}`)}
              >
                View Interview Kit
              </Button>
            </div>
          )}

          {state?.purchaseId && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>Order Number:</strong> {state.purchaseId}
              </p>
              {state.type === 'service' && serviceSlug !== 'javascript-interview-mastery-kit' && (
                <>
                  {isLoadingAccess ? (
                    <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                      <LoadingSpinner size="sm" />
                      <span>Preparing your access...</span>
                    </div>
                  ) : accessLink ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        🎉 Your document is ready!
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={() => window.open(accessLink, '_blank')}
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
                        Access Your Document
                      </Button>
                      {accessExpiresAt && (
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Access expires: {new Date(accessExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Important:</strong> Your access link is being prepared. You can access it from your dashboard.
                    </p>
                  )}
                </>
              )}
              {state.type === 'course' && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> You now have access to your course. Check your dashboard to get started!
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/premium')}>
              Browse More
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            {state?.type === 'service' && 
             serviceSlug === 'javascript-interview-mastery-kit' && 
             state.serviceId
              ? 'Redirecting to your Interview Kit in 8 seconds...'
              : 'Redirecting to dashboard in 8 seconds...'}
          </p>
        </Card>
      </div>
    </div>
  )
}

