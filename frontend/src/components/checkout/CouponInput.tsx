import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateCoupon, type ValidateCouponData } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { logger } from '@/utils/logger'

interface CouponInputProps {
  purchaseType: 'course' | 'service'
  itemId: string
  amount: number
  onCouponApplied: (discount: number, finalAmount: number, couponCode: string) => void
  onCouponRemoved: () => void
  appliedCouponCode?: string
}

export function CouponInput({
  purchaseType,
  itemId,
  amount,
  onCouponApplied,
  onCouponRemoved,
  appliedCouponCode,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const { showSuccess, showError } = useToast()
  const { handleError } = useErrorHandler()

  const handleApply = async () => {
    // Prevent double submission
    if (isValidating) {
      return
    }

    if (!couponCode.trim()) {
      showError('Please enter a coupon code')
      return
    }

    // Validate amount
    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showError('Invalid amount. Please refresh the page and try again.')
      return
    }

    // Validate required fields
    if (!itemId || !purchaseType) {
      logger.error('Missing required fields:', { itemId, purchaseType, amount })
      showError('Missing required information. Please refresh the page and try again.')
      return
    }

    try {
      setIsValidating(true)

      const data: ValidateCouponData = {
        code: couponCode.trim().toUpperCase(),
        purchaseType,
        itemId,
        amount: numericAmount,
      }

      logger.log('Validating coupon with data:', data)

      const response = await validateCoupon(data)
      logger.log('Coupon validation response:', response)

      // Check if response structure is correct
      if (!response || !response.data) {
        logger.error('Invalid response structure:', response)
        showError('Invalid response from server. Please try again.')
        return
      }

      if (response.data.valid) {
        onCouponApplied(
          response.data.discount,
          response.data.finalAmount,
          response.data.couponCode || couponCode.trim().toUpperCase()
        )
        showSuccess(response.data.message || 'Coupon applied successfully!')
        setCouponCode('')
      } else {
        showError(response.data.message || 'Invalid coupon code')
      }
    } catch (error: any) {
      logger.error('Coupon validation error:', error)
      logger.error('Error response:', error?.response?.data)
      logger.error('Error status:', error?.response?.status)
      
      // Handle different error scenarios
      if (error?.response) {
        const status = error.response.status
        const responseData = error.response.data

        if (status === 400) {
          // Validation error from backend
          if (responseData?.data?.message) {
            showError(responseData.data.message)
          } else if (responseData?.message) {
            showError(responseData.message)
          } else if (responseData?.error) {
            showError(responseData.error)
          } else {
            showError('Invalid coupon code. Please check the code and try again.')
          }
        } else if (status === 401) {
          showError('Please log in to apply coupons.')
        } else if (status === 429) {
          showError('Too many requests. Please wait a moment and try again.')
        } else if (status >= 500) {
          showError('Server error. Please try again later.')
        } else if (responseData?.message) {
          showError(responseData.message)
        } else {
          showError('Failed to validate coupon. Please try again.')
        }
      } else if (error?.message) {
        // Network error or other error
        showError(error.message)
      } else {
        // Fallback to generic error handler
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'CouponInput', action: 'handleApply' },
        })
      }
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemove = () => {
    onCouponRemoved()
    setCouponCode('')
    showSuccess('Coupon removed')
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Have a coupon code?
        </label>
        {!appliedCouponCode ? (
          <div className="flex gap-2">
            <Input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1"
              disabled={isValidating}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isValidating) {
                  handleApply()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleApply}
              disabled={isValidating || !couponCode.trim()}
              variant="outline"
              size="md"
            >
              {isValidating ? 'Applying...' : 'Apply'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Coupon <strong>{appliedCouponCode}</strong> applied
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
              aria-label="Remove coupon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

