import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LoginSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

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
            Login Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! You've successfully logged in to your account.
          </p>
        </div>

        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            <strong>Welcome back!</strong> Continue your learning journey from where you left off.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(redirectUrl || '/dashboard', { replace: true })}
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  )
}

