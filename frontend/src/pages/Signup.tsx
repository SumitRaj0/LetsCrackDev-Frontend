import { useNavigate } from 'react-router-dom'
import { AuthContent } from '@/components/auth/AuthContent'

export default function Signup() {
  const navigate = useNavigate()

  const handleSignupSuccess = () => {
    // Navigate to signup success page
    navigate('/signup/success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthContent
          initialMode="signup"
          onClose={handleSignupSuccess}
          variant="page"
        />
      </div>
    </div>
  )
}
