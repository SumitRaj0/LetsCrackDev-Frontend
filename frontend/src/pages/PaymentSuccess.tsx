import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    purchaseId?: string
    amount?: number
    type?: string
  } | null

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

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

          {state?.purchaseId && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>Order Number:</strong> {state.purchaseId}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> Soon you will get access to your{' '}
                {state.type === 'course' ? 'course' : 'service'}. We'll notify you once it's ready!
              </p>
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
            Redirecting to dashboard in 5 seconds...
          </p>
        </Card>
      </div>
    </div>
  )
}

