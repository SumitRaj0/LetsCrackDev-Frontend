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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          {coupon ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="uppercase"
            />
            {coupon && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Coupon code cannot be changed after creation
              </p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
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
              />
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive ?? true}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (coupon can be used)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

