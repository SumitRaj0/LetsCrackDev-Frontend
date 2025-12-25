import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCoupon, updateCoupon, type Coupon, type CreateCouponData } from '@/lib/api/coupons.api'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  coupon?: Coupon | null
  onSuccess?: () => void
}

export function CouponModal({ isOpen, onClose, coupon, onSuccess }: CouponModalProps) {
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateCouponData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    applicableTo: 'all',
    isActive: true,
  })

  useEffect(() => {
    if (coupon) {
      // Edit mode - populate form with coupon data
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
        validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit,
        userLimit: coupon.userLimit,
        applicableTo: coupon.applicableTo,
        description: coupon.description,
        isActive: coupon.isActive,
      })
    } else {
      // Create mode - reset form
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        applicableTo: 'all',
        isActive: true,
      })
    }
  }, [coupon, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.code.trim()) {
      handleError(new Error('Coupon code is required'), { showToast: true })
      return
    }

    if (formData.discountValue <= 0) {
      handleError(new Error('Discount value must be greater than 0'), { showToast: true })
      return
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      handleError(new Error('Percentage discount cannot exceed 100%'), { showToast: true })
      return
    }

    if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      handleError(new Error('Valid until date must be after valid from date'), { showToast: true })
      return
    }

    try {
      setIsLoading(true)

      // Convert dates to ISO strings
      const submitData = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      }

      if (coupon) {
        await updateCoupon(coupon.id, submitData)
        showSuccess('Coupon updated successfully')
      } else {
        await createCoupon(submitData)
        showSuccess('Coupon created successfully')
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'CouponModal', action: 'handleSubmit' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" variant="light">
      <div className="p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {coupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {coupon ? 'Update coupon details and settings' : 'Set up a new discount coupon for your customers'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="TEST20"
              required
              disabled={!!coupon} // Can't change code when editing
              className="uppercase font-mono text-lg font-bold"
            />
            {coupon && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Coupon code cannot be changed after creation
              </p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue || ''}
                  onChange={handleChange}
                  placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                  min="0"
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  required
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                  {formData.discountType === 'percentage' ? '%' : '₹'}
                </span>
              </div>
            </div>
          </div>

          {/* Min/Max Purchase Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Purchase Amount (₹)
              </label>
              <Input
                type="number"
                name="minPurchaseAmount"
                value={formData.minPurchaseAmount || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Discount Amount (₹)
                </label>
                <Input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount || ''}
                  onChange={handleChange}
                  placeholder="No limit"
                  min="0"
                  step="0.01"
                />
              </div>
            )}
          </div>

          {/* Validity Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid From <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid Until <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usage Limit
              </label>
              <Input
                type="number"
                name="usageLimit"
                value={formData.usageLimit || ''}
                onChange={handleChange}
                placeholder="No limit"
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total number of times this coupon can be used
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Limit
              </label>
              <Input
                type="number"
                name="userLimit"
                value={formData.userLimit || ''}
                onChange={handleChange}
                placeholder="No limit"
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max times a single user can use this coupon
              </p>
            </div>
          </div>

          {/* Applicable To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Applicable To <span className="text-red-500">*</span>
            </label>
            <select
              name="applicableTo"
              value={
                Array.isArray(formData.applicableTo)
                  ? 'specific'
                  : (formData.applicableTo as string)
              }
              onChange={e => {
                const value = e.target.value
                if (value === 'specific') {
                  // For now, we'll just set to 'all' - specific items can be added later
                  setFormData(prev => ({ ...prev, applicableTo: 'all' }))
                } else {
                  setFormData(prev => ({ ...prev, applicableTo: value as 'all' | 'course' | 'service' }))
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            >
              <option value="all">All Items</option>
              <option value="course">Courses Only</option>
              <option value="service">Services Only</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Optional description for this coupon"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <div>
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Active Status
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  When active, this coupon can be used by customers
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} size="lg">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} size="lg">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : coupon ? (
                'Update Coupon'
              ) : (
                'Create Coupon'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

