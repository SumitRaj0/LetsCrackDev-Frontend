import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'

// SVG Icon Components
const RocketIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l3-3m-6 0l3 3" />
  </svg>
)

const GraduationCapIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
  </svg>
)

const ChartIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const LightningIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const MobileIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

export default function PremiumBenefits() {
  const navigate = useNavigate()

  const premiumFeatures = [
    {
      icon: <RocketIcon />,
      title: 'Unlimited Resources',
      description: 'Access to all premium resources without any restrictions',
    },
    {
      icon: <GraduationCapIcon />,
      title: 'Exclusive Courses',
      description: 'Premium-only courses taught by industry experts',
    },
    {
      icon: <ChartIcon />,
      title: 'Personalized Learning Paths',
      description: 'AI-powered recommendations tailored to your goals',
    },
    {
      icon: <LightningIcon />,
      title: 'Priority Support',
      description: 'Get help from our team within 24 hours',
    },
    {
      icon: <MobileIcon />,
      title: 'Ad-Free Experience',
      description: 'Learn without interruptions or distractions',
    },
    {
      icon: <SearchIcon />,
      title: 'Advanced Search',
      description: 'Powerful filters and search capabilities',
    },
  ]

  const exclusiveContent = [
    '50+ Premium-only courses',
    'Weekly live coding sessions',
    'Early access to new features',
    'Exclusive community forum access',
    'Certificate of completion',
    'Career guidance and mentorship',
  ]

  return (
    <div className="min-h-screen bg-app-gradient">
      <PageHero
        title="Premium Benefits"
        description="Discover everything you get with a Premium subscription"
      />

      {/* Premium Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4 tracking-tight">
            What You Get with Premium
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Unlock a complete learning environment designed to help you grow faster, build better
            projects, and move your career forward with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border border-indigo-200/40 dark:border-indigo-700/40 
                           bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl 
                           transition-all duration-200 group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-400/15 dark:bg-purple-500/15 rounded-full blur-3xl" />
                </div>

                <div className="relative">
                  <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50/80 dark:bg-indigo-900/40 shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exclusive Content */}
      <div className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-indigo-200/40 dark:border-indigo-700/40 backdrop-blur-sm p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 tracking-tight">
              Exclusive Premium Content
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Premium isn&apos;t just more content — it&apos;s access to curated experiences, live
              sessions, and career-focused perks built specifically for serious developers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {exclusiveContent.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-gray-200/60 dark:border-gray-700/70 
                             bg-gray-50/80 dark:bg-gray-900/60 px-4 py-3"
                >
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
                  <span className="text-sm text-gray-800 dark:text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-indigo-200/40 dark:border-indigo-700/40 backdrop-blur-sm p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Ready to Upgrade?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who are already using Premium to accelerate their learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => navigate('/premium/checkout')} size="lg">
              Proceed to Checkout
            </Button>
            <Link
              to="/premium"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              Back to Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
