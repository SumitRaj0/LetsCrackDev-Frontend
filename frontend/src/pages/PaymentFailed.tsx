import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PaymentFailed() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <PageHero title="Payment Failed" description="Something went wrong with your payment" />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't process your payment. Please try again or contact support if the problem
              persists.
            </p>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> If money was deducted from your account, it will be refunded
              automatically within 5-7 business days.
            </p>
          </div>

          <div className="space-y-4">
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate(-1)}>
              Try Again
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/premium')}>
              Back to Premium
            </Button>
            <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

