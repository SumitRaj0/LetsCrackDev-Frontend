import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SignupSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to LetsCrackDev!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your account has been successfully created. You're all set to start your learning journey.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Get Started:</strong> As a registered user, you can now save resources, track your
            progress, and access your personalized dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

