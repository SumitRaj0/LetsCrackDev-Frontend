import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { premiumCourses } from '@/data/premiumCourses'
import { premiumServices } from '@/data/premiumServices'

export default function PremiumCheckout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'course'
  const id = searchParams.get('id') || ''
  const priceParam = searchParams.get('price')

  // Get the item details
  const course = type === 'course' ? premiumCourses.find(c => c.id === id) : null
  const service = type === 'service' ? premiumServices.find(s => s.id === id) : null
  const item = course || service

  // Get price from URL param or item, default to 99 if not found
  const price = priceParam ? parseFloat(priceParam) : item?.price || 99
  const itemTitle = item?.title || 'Premium Plan'

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Navigate to dashboard after successful payment
      navigate('/dashboard')
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      <PageHero title="Checkout" description="Complete your Premium subscription" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <Input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        maxLength={4}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" id="terms" required className="w-4 h-4" />
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    variant="primary"
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${price.toFixed(0)}`}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => navigate('/premium/benefits')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Cancel and Return
                  </Button>
                </form>
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
                      {itemTitle}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-2xl text-gray-900 dark:text-white">
                        ₹{price.toFixed(0)}
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
                    {type === 'course' && course ? (
                      <>
                        <li>• Full course access</li>
                        <li>• Lifetime access</li>
                        <li>• All course materials</li>
                        <li>• Certificate of completion</li>
                      </>
                    ) : service ? (
                      <>
                        <li>• Full service access</li>
                        <li>• Lifetime access</li>
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </>
                    ) : (
                      <>
                        <li>• Unlimited resources</li>
                        <li>• Exclusive courses</li>
                        <li>• Priority support</li>
                        <li>• Ad-free experience</li>
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
