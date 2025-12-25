import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllCoupons, deleteCoupon, updateCoupon, type Coupon } from '@/lib/api/coupons.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { CouponModal } from '@/components/admin/CouponModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function AdminCoupons() {
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired' | 'upcoming'>('all')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; couponId: string | null; couponCode: string }>({
    isOpen: false,
    couponId: null,
    couponCode: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)

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

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date()
    return {
      total: coupons.length,
      active: coupons.filter(c => c.isActive && new Date(c.validUntil) >= now && new Date(c.validFrom) <= now).length,
      inactive: coupons.filter(c => !c.isActive).length,
      expired: coupons.filter(c => new Date(c.validUntil) < now).length,
      upcoming: coupons.filter(c => new Date(c.validFrom) > now).length,
      totalUsage: coupons.reduce((sum, c) => sum + c.usageCount, 0),
    }
  }, [coupons])

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    let filtered = [...coupons]
    const now = new Date()

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        c => c.code.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query)
      )
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(c => c.isActive && new Date(c.validUntil) >= now && new Date(c.validFrom) <= now)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(c => !c.isActive)
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(c => new Date(c.validUntil) < now)
    } else if (statusFilter === 'upcoming') {
      filtered = filtered.filter(c => new Date(c.validFrom) > now)
    }

    return filtered
  }, [searchQuery, statusFilter, coupons])

  const handleDeleteClick = (coupon: Coupon) => {
    setDeleteConfirm({
      isOpen: true,
      couponId: coupon.id,
      couponCode: coupon.code,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.couponId) return

    try {
      setIsDeleting(true)
      await deleteCoupon(deleteConfirm.couponId)
      showSuccess('Coupon deleted successfully')
      setDeleteConfirm({ isOpen: false, couponId: null, couponCode: '' })
      fetchCoupons()
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminCoupons', action: 'handleDelete' },
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive })
      showSuccess(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'} successfully`)
      fetchCoupons()
    } catch (error) {
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'AdminCoupons', action: 'handleToggleStatus' },
      })
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    showSuccess('Coupon code copied to clipboard!')
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

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Coupons</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total Usage</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalUsage}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Search by code or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className="text-xs"
              >
                All ({stats.total})
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className="text-xs"
              >
                Active ({stats.active})
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('inactive')}
                className="text-xs"
              >
                Inactive ({stats.inactive})
              </Button>
              <Button
                variant={statusFilter === 'expired' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('expired')}
                className="text-xs"
              >
                Expired ({stats.expired})
              </Button>
              <Button
                variant={statusFilter === 'upcoming' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('upcoming')}
                className="text-xs"
              >
                Upcoming ({stats.upcoming})
              </Button>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {filteredCoupons.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No coupons found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first coupon'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={handleCreate} variant="primary" size="md">
                  + Create Your First Coupon
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Coupon Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Validity Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Applicable To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                    const isCurrentlyActive = coupon.isActive && !expired && !upcoming

                    return (
                      <tr
                        key={coupon.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                  {coupon.code}
                                </span>
                                <button
                                  onClick={() => handleCopyCode(coupon.code)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Copy code"
                                >
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                              {coupon.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {coupon.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {coupon.discountType === 'percentage'
                                ? `${coupon.discountValue}%`
                                : `₹${coupon.discountValue}`}
                            </span>
                            {coupon.discountType === 'percentage' && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">OFF</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 mt-1">
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
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="font-medium">{formatDate(coupon.validFrom)}</div>
                            <div className="text-gray-500 dark:text-gray-400">to</div>
                            <div className="font-medium">{formatDate(coupon.validUntil)}</div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {expired && (
                              <Badge variant="error" className="text-xs">
                                Expired
                              </Badge>
                            )}
                            {upcoming && (
                              <Badge variant="info" className="text-xs">
                                Upcoming
                              </Badge>
                            )}
                            {!expired && !upcoming && isCurrentlyActive && (
                              <Badge variant="success" className="text-xs">
                                Live
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {coupon.usageCount} / {coupon.usageLimit || '∞'}
                          </div>
                          {coupon.usageLimit && coupon.usageLimit > 0 && (
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
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
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              coupon.applicableTo === 'all'
                                ? 'default'
                                : coupon.applicableTo === 'course'
                                  ? 'info'
                                  : 'warning'
                            }
                          >
                            {Array.isArray(coupon.applicableTo)
                              ? `${coupon.applicableTo.length} items`
                              : coupon.applicableTo === 'all'
                                ? 'All Items'
                                : coupon.applicableTo === 'course'
                                  ? 'Courses'
                                  : 'Services'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={coupon.isActive ? 'success' : 'default'}>
                              {coupon.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <button
                              onClick={() => handleToggleStatus(coupon)}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                              title={coupon.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {coupon.isActive ? (
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(coupon)}
                              className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(coupon)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 hover:border-red-400 dark:border-red-700"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, couponId: null, couponCode: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteConfirm.couponCode}"? This action cannot be undone and all usage data will be lost.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

