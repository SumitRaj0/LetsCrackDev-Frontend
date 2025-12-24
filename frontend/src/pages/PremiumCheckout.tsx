import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createCheckout, verifyPayment } from '@/lib/api'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { getStoredUser, isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'
import { useUser } from '@/contexts/UserContext'
import { useToast } from '@/contexts/ToastContext'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { CouponInput } from '@/components/checkout/CouponInput'

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PremiumCheckout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'course'
  const id = searchParams.get('id') || ''
  const priceParam = searchParams.get('price')

  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>()
  const { handleError } = useErrorHandler()
  const { user, isLoading: userLoading } = useUser()
  const { showError: showToastError } = useToast()
  const { isOpen, mode, openModal, closeModal } = useAuthModal()
  const storedUser = getStoredUser()

  // Get price from URL param
  const price = priceParam ? parseFloat(priceParam) : 0

  // Initialize finalAmount with price
  useEffect(() => {
    if (price > 0 && finalAmount === 0) {
      setFinalAmount(price)
    }
  }, [price, finalAmount])

  useEffect(() => {
    // Validate required params
    if (!id || !type || !price) {
      handleError(new Error('Missing required checkout parameters'), {
        showToast: true,
        logError: true,
      })
      navigate('/premium')
      return
    }

    // Check authentication - open modal instead of navigating
    if (!userLoading && !isAuthenticatedWithPasswordGrant()) {
      const redirectPath = `/premium/checkout?type=${type}&id=${id}&price=${price}`
      openModal('login', redirectPath)
    }
  }, [id, type, price, navigate, handleError, userLoading, user, openModal])

  const handlePayment = async () => {
    // Check authentication before proceeding
    if (!isAuthenticatedWithPasswordGrant()) {
      const redirectPath = `/premium/checkout?type=${type}&id=${id}&price=${price}`
      openModal('login', redirectPath)
      return
    }

    if (!id || !type || !price) {
      handleError(new Error('Missing required checkout parameters'), {
        showToast: true,
        logError: true,
      })
      return
    }

    if (!window.Razorpay) {
      handleError(new Error('Razorpay is not loaded. Please refresh the page.'), {
        showToast: true,
        logError: true,
      })
      return
    }

    try {
      setIsLoading(true)

      // Create order on backend
      const checkoutData = {
        purchaseType: type as 'service' | 'course',
        serviceId: type === 'service' ? id : undefined,
        courseId: type === 'course' ? id : undefined,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        couponCode: appliedCouponCode,
      }

      const response = await createCheckout(checkoutData)

      if (!response.success || !response.data) {
        throw new Error('Failed to create order')
      }

      const { orderId, amount, currency, keyId } = response.data

      // Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount, // Amount in paise
        currency: currency,
        name: 'LetsCrackDev',
        description: `${type === 'course' ? 'Course' : 'Service'} Purchase`,
        order_id: orderId,
        handler: async function (paymentResponse: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          // Payment successful - verify with backend
          try {
            setIsProcessing(true)
            const verifyResponse = await verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            })

            if (verifyResponse.success) {
              // Navigate to success page
              navigate('/payment/success', {
                state: {
                  purchaseId: response.data.purchaseId,
                  amount: price,
                  type,
                },
              })
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            handleError(error, {
              showToast: true,
              logError: true,
              context: { component: 'PremiumCheckout', action: 'verifyPayment' },
            })
            navigate('/payment/failed')
          } finally {
            setIsProcessing(false)
          }
        },
        prefill: {
          name: user?.name || storedUser?.name || '',
          email: user?.email || storedUser?.email || '',
          contact: user?.phone || storedUser?.phone || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            // User closed the checkout without payment
            navigate('/premium')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'PremiumCheckout', action: 'createCheckout' },
      })
    }
  }

  // Show loading while checking user authentication
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Check authentication - show modal instead of separate page
  if (!isAuthenticatedWithPasswordGrant()) {
    return (
      <>
        <AuthModal isOpen={isOpen} onClose={closeModal} initialMode={mode} blankBackground={true} />
        {/* Show checkout page in background (will be covered by modal) */}
        <div style={{ opacity: 0.3, pointerEvents: 'none' }}>
          {/* Render the checkout content but make it non-interactive */}
        </div>
      </>
    )
  }

  if (!id || !type || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Checkout
          </h1>
          <Button onClick={() => navigate('/premium')}>Back to Premium</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHero title="Checkout" description="Complete your purchase" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="lg:col-span-2">
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment Details
                </h2>

                <div className="space-y-6">
                      {/* Coupon Input */}
                      <CouponInput
                        purchaseType={type as 'course' | 'service'}
                        itemId={id}
                        amount={price}
                        onCouponApplied={(discountAmount, finalPrice, couponCode) => {
                          setDiscount(discountAmount)
                          setFinalAmount(finalPrice)
                          setAppliedCouponCode(couponCode)
                        }}
                        onCouponRemoved={() => {
                          setDiscount(0)
                          setFinalAmount(price)
                          setAppliedCouponCode(undefined)
                        }}
                        appliedCouponCode={appliedCouponCode}
                      />

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Secure Payment:</strong> Your payment will be processed securely
                          through Razorpay. We do not store your card details.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4">
                        <input type="checkbox" id="terms" required className="w-4 h-4" />
                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>

                      <Button
                        onClick={handlePayment}
                        disabled={isLoading || isProcessing}
                        variant="primary"
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Creating Order...
                          </>
                        ) : isProcessing ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Verifying Payment...
                          </>
                        ) : (
                          `Pay ₹${finalAmount.toFixed(0)}`
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => navigate('/premium')}
                        variant="outline"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || isProcessing}
                      >
                        Cancel and Return
                      </Button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {type === 'course' ? 'Course' : 'Service'}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                      {type === 'course' ? 'Premium Course' : 'Premium Service'}
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">₹{price.toFixed(0)}</span>
                    </div>
                    {discount > 0 && appliedCouponCode && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount ({appliedCouponCode})
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          -₹{discount.toFixed(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-2 border-t">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-2xl text-gray-900 dark:text-white">
                        ₹{finalAmount.toFixed(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      One-time payment
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                    What's Included:
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    {type === 'course' ? (
                      <>
                        <li>• Full course access</li>
                        <li>• Lifetime access</li>
                        <li>• All course materials</li>
                        <li>• Certificate of completion</li>
                      </>
                    ) : (
                      <>
                        <li>• Full service access</li>
                        <li>• Lifetime access</li>
                        <li>• Priority support</li>
                        <li>• All deliverables</li>
                      </>
                    )}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
