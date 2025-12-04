import { useParams, useNavigate } from 'react-router-dom'
import { premiumServices } from '@/data/premiumServices'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PremiumServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const service = premiumServices.find(s => s.id === id)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h1>
          <Button onClick={() => navigate('/premium')}>Back to Premium</Button>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Career':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'AI Tools':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'Templates':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Premium
          </Button>

          <div className="max-w-3xl">
            <div className="mb-4">
              <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{service.description}</p>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{service.price}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400">one-time payment</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  navigate(`/premium/checkout?type=service&id=${service.id}&price=${service.price}`)
                }
              >
                Pay Now - ₹{service.price}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/premium')}>
                Back to Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Features */}
          {service.features.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* How It Works */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Get Premium Access
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Subscribe to Premium to unlock all services and courses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Access the Service
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Start using the service immediately after getting Premium access.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Results</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use the service to achieve your goals and accelerate your career.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get Premium access to unlock this service and all other premium features.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                navigate(`/premium/checkout?type=service&id=${service.id}&price=${service.price}`)
              }
            >
              Pay Now - ₹{service.price}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
