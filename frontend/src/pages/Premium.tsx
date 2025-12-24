import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { getServices, getCourses } from '@/lib/api'
import { Service } from '@/lib/api/services.api'
import { Course } from '@/lib/api/courses.api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { ReviewCard } from '@/components/shared/ReviewCard'
import { reviews } from '@/data/reviews'
import { Card } from '@/components/ui/card'

export default function Premium() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'courses' | 'services'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { handleError } = useErrorHandler()

  // Calculate total duration from lessons
  const getTotalDuration = (course: Course): string => {
    if (!course.lessons || !Array.isArray(course.lessons) || course.lessons.length === 0) {
      return '0m'
    }
    const totalMinutes = course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Map difficulty to level format
  const mapDifficultyToLevel = (difficulty: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const map: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    }
    return map[difficulty] || 'Beginner'
  }

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      if (activeTab === 'courses') {
        try {
          setIsLoading(true)
          const response = await getCourses({
            isPremium: true,
            limit: 50, // Get all premium courses
          })
          setCourses(response.data.courses)
        } catch (error) {
          handleError(error, {
            showToast: true,
            logError: true,
            context: { component: 'Premium', action: 'fetchCourses' },
          })
          setCourses([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCourses()
  }, [activeTab, handleError])

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      if (activeTab === 'services') {
        try {
          setIsLoading(true)
          const response = await getServices({
            availability: true,
            limit: 50, // Get all available services
          })
          setServices(response.data.services)
        } catch (error) {
          handleError(error, {
            showToast: true,
            logError: true,
            context: { component: 'Premium', action: 'fetchServices' },
          })
          setServices([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchServices()
  }, [activeTab, handleError])

  return (
    <div className="min-h-screen">
      <PageHero
        title="Premium Courses & Developer Services"
        description="Everything you need to learn faster, build smarter, and get hired confidently."
      />

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'courses'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Courses
            {activeTab === 'courses' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'services'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Services
            {activeTab === 'services' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'courses' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <PremiumCard
                    key={course._id}
                    item={{
                      id: course._id,
                      title: course.title,
                      description: course.description,
                      level: mapDifficultyToLevel(course.difficulty),
                      duration: getTotalDuration(course),
                      isPremium: course.isPremium,
                      tags: [course.category],
                      enrolledCount: 0, // Backend doesn't have this
                      price: course.price,
                    }}
                    type="course"
                  />
            ))}
          </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400">No premium courses available at the moment.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'services' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <PremiumCard
                    key={service._id}
                    item={{
                      id: service._id,
                      title: service.name,
                      description: service.description,
                      category: service.category === 'resume' ? 'Career' : 
                                service.category === 'interview' ? 'Interview' :
                                service.category === 'mentorship' ? 'Career' :
                                service.category === 'portfolio' ? 'Career' : 'Career',
                      features: service.deliverables,
                      isPremium: true,
                      optedCount: 0, // Backend doesn't have this
                      price: service.price,
                    }}
                    type="service"
                  />
            ))}
          </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400">No services available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4 tracking-tight">
            Free vs Premium
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Compare features and choose the plan that's right for you
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Features</th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Free</th>
                  <th className="text-center p-4 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Access to Free Resources</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Premium Courses</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Premium Services</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Priority Support</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Ad-Free Experience</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-gray-700 dark:text-gray-300">Certificate of Completion</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-700 dark:text-gray-300">Career Guidance & Mentorship</td>
                  <td className="text-center p-4">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4 tracking-tight">
          What Our Community Says
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Join thousands of developers who are accelerating their careers with Premium
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Everything you need to know about Premium
          </p>
          
          <div className="space-y-4">
            {[
              {
                question: 'What is included in Premium?',
                answer: 'Premium includes access to all premium courses, developer services (resume builder, interview kits, portfolio builder, etc.), priority support, ad-free experience, certificates of completion, and career guidance.',
              },
              {
                question: 'How do I purchase Premium?',
                answer: 'You can purchase individual premium courses or services. Simply browse our premium offerings, select what you need, and proceed to checkout. We accept all major payment methods through Razorpay.',
              },
              {
                question: 'Can I get a refund?',
                answer: 'Yes, we offer a 7-day money-back guarantee for all premium courses. If you\'re not satisfied, contact our support team within 7 days of purchase for a full refund.',
              },
              {
                question: 'Do I need to pay monthly?',
                answer: 'No, our premium courses and services are one-time purchases. Once you buy a course or service, you have lifetime access to it.',
              },
              {
                question: 'Are the courses self-paced?',
                answer: 'Yes, all premium courses are self-paced. You can learn at your own speed and access the content anytime, anywhere.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, net banking, and UPI through our secure payment partner Razorpay.',
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Ready to Get Premium?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Unlock all premium courses and services to accelerate your development career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/premium/checkout')}>
              Get Premium
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/premium/benefits')}>
              View Benefits
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
