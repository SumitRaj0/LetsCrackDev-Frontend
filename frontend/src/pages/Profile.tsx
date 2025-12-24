import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { dummyUser } from '@/lib/dummyUser'
import { useUser } from '@/hooks/useUser'
import axiosClient from '@/lib/api/axiosClient'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'
import { storeAuthUser } from '@/utils/authStorage'

export default function Profile() {
  const { user, refreshUser } = useUser()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useToast()

  // Use real user data for editable fields, fall back to dummy only if needed
  const [name, setName] = useState(user?.name || dummyUser.name)
  const [email, setEmail] = useState(user?.email || dummyUser.email)
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [isUpdating, setIsUpdating] = useState(false)

  // For non-editable stats and dates we can safely merge with dummy
  const profileUser = {
    ...dummyUser,
    name: user?.name || dummyUser.name,
    email: user?.email || dummyUser.email,
    joinDate: user?.createdAt || dummyUser.joinDate,
  }

  // Keep local form state in sync when user data changes (e.g. after login or profile update)
  useEffect(() => {
    setName(user?.name || dummyUser.name)
    setEmail(user?.email || dummyUser.email)
    setPhone(user?.phone ?? '')
  }, [user])
  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      const response = await axiosClient.put('/auth/me', {
        name,
        email,
        phone,
      })

      // Update stored user so UserContext and other UI pick up the latest values
      const updatedUser = (response.data as any)?.data?.user
      if (updatedUser) {
        storeAuthUser({
          sub: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          picture: updatedUser.avatar,
          phone: updatedUser.phone,
          createdAt: updatedUser.createdAt,
        })
        
        // Update local state immediately so UI reflects changes right away
        setName(updatedUser.name)
        setEmail(updatedUser.email)
        setPhone(updatedUser.phone || '')
      }

      showSuccess('Profile updated successfully')
      await refreshUser()
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'Profile', action: 'handleUpdate' },
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Personal Information
              </h2>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating}
                variant="primary"
                size="md"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  rounded="default"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  rounded="default"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  rounded="default"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Since
                </label>
                <Input
                  type="text"
                  defaultValue={new Date(profileUser.joinDate).toLocaleDateString()}
                  disabled
                  rounded="default"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              Learning Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-black dark:text-white mb-1">
                  {profileUser.learningHours}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Learning Hours</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black dark:text-white mb-1">
                  {profileUser.savedResources.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved Resources</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black dark:text-white mb-1">
                  {profileUser.enrolledCourses.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
