import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllCoupons, deleteCoupon, type Coupon } from '@/lib/api/coupons.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { CouponModal } from '@/components/admin/CouponModal'

export default function AdminCoupons() {
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  // Fetch coupons from API
  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCoupons()
      setCoupons(data)
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminCoupons', action: 'fetchCoupons' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    let filtered = [...coupons]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        c => c.code.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query)
      )
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(c => c.isActive)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(c => !c.isActive)
    }

    return filtered
  }, [searchQuery, statusFilter, coupons])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
      return
    }

    try {
      await deleteCoupon(id)
      showSuccess('Coupon deleted successfully')
      fetchCoupons()
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminCoupons', action: 'handleDelete' },
      })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCoupon(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCoupon(null)
    fetchCoupons()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const isUpcoming = (validFrom: string) => {
    return new Date(validFrom) > new Date()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" showText />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Coupon Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Create and manage discount coupons</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/admin"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <Button onClick={handleCreate} variant="primary" size="md">
                + Create Coupon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
          {filteredCoupons.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No coupons found</p>
              <Button onClick={handleCreate} variant="primary" size="md">
                Create Your First Coupon
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Applicable To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCoupons.map(coupon => {
                    const expired = isExpired(coupon.validUntil)
                    const upcoming = isUpcoming(coupon.validFrom)
                    const usagePercentage =
                      coupon.usageLimit && coupon.usageLimit > 0
                        ? Math.round((coupon.usageCount / coupon.usageLimit) * 100)
                        : 0

                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono font-semibold text-black dark:text-white">
                            {coupon.code}
                          </div>
                          {coupon.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coupon.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black dark:text-white">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`}
                          </div>
                          {coupon.maxDiscountAmount && coupon.discountType === 'percentage' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Max: ₹{coupon.maxDiscountAmount}
                            </div>
                          )}
                          {coupon.minPurchaseAmount && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Min: ₹{coupon.minPurchaseAmount}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black dark:text-white">
                            {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                          </div>
                          {expired && (
                            <Badge variant="error" className="mt-1">
                              Expired
                            </Badge>
                          )}
                          {upcoming && (
                            <Badge variant="info" className="mt-1">
                              Upcoming
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black dark:text-white">
                            {coupon.usageCount} / {coupon.usageLimit || '∞'}
                          </div>
                          {coupon.usageLimit && coupon.usageLimit > 0 && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercentage >= 100
                                    ? 'bg-red-500'
                                    : usagePercentage >= 80
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="default">
                            {Array.isArray(coupon.applicableTo)
                              ? `${coupon.applicableTo.length} items`
                              : coupon.applicableTo}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {coupon.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="default">Inactive</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(coupon)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(coupon.id)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <CouponModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          coupon={editingCoupon}
          onSuccess={handleModalClose}
        />
      )}
    </div>
  )
}

