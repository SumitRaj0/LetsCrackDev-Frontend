import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContent } from '@/components/auth/AuthContent'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  const handleLoginSuccess = () => {
    // Navigate to redirect URL if present, otherwise to success page
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true })
    } else {
      navigate('/login/success')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthContent
          initialMode="login"
          onClose={handleLoginSuccess}
          variant="page"
        />
      </div>
    </div>
  )
}
