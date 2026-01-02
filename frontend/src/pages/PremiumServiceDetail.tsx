import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getServiceById, getPurchases } from '@/lib/api'
import { Service } from '@/lib/api/services.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { getServiceDetailConfig } from '@/data/services'
import { isAuthenticatedWithPasswordGrant } from '@/utils/authStorage'

export default function PremiumServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const { handleError } = useErrorHandler()

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getServiceById(id)
        if (response.success && response.data) {
          setService(response.data.service)
        } else {
          throw new Error('Service not found')
        }
      } catch (error) {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'PremiumServiceDetail', action: 'fetchService' },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchService()
  }, [id, handleError])

  // Check if user has already purchased this service
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!id || !isAuthenticatedWithPasswordGrant() || !service) return

      try {
        const response = await getPurchases({
          status: 'completed',
          purchaseType: 'service',
        })
        if (response.success) {
          const hasPurchasedService = response.data.purchases.some(
            (purchase) => purchase.serviceId?._id === id || purchase.serviceId?._id === service._id
          )
          setHasPurchased(hasPurchasedService)
        }
      } catch (error) {
        // Silently fail - don't block the page if purchase check fails
        console.log('Could not check purchase status')
      }
    }

    checkPurchaseStatus()
  }, [id, service])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'mentorship':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'portfolio':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
      case 'crash-course':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getCategoryDisplayName = (category: string) => {
    const map: Record<string, string> = {
      resume: 'Career',
      interview: 'Interview',
      mentorship: 'Mentorship',
      portfolio: 'Portfolio',
      'crash-course': 'Crash Course',
    }
    return map[category] || category
  }

  // Get service detail config if available
  const serviceConfig = service ? getServiceDetailConfig(service.slug) : null

  // Helper function to render text with markdown-style bold formatting
  const renderMarkdownText = (text: string) => {
    const parts: (string | JSX.Element)[] = []
    const regex = /\*\*(.*?)\*\*/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(<strong key={match.index}>{match[1]}</strong>)
      lastIndex = regex.lastIndex
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? <>{parts}</> : text
  }

  // Helper function to render text with line breaks and markdown
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle bullet points starting with *
      if (line.trim().startsWith('*')) {
        const content = line.trim().substring(1).trim()
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-gray-700 dark:text-gray-300 mt-1">•</span>
            <span className="text-gray-700 dark:text-gray-300 flex-1">{renderMarkdownText(content)}</span>
          </div>
        )
      }
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {renderMarkdownText(line)}
        </p>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h1>
          <Button onClick={() => navigate('/premium')}>Back to Premium</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Premium
          </Button>

          <div className="max-w-3xl">
            <div className="mb-4">
              <Badge className={getCategoryColor(service.category)}>
                {getCategoryDisplayName(service.category)}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h1>
            {serviceConfig?.subtitle && (
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                {serviceConfig.subtitle}
              </p>
            )}
            {service.slug === 'javascript-interview-mastery-kit' ? (
              <>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Stop Failing JavaScript Interviews. Start Clearing Them.</strong>
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  A premium, interview-focused JavaScript preparation kit built from <strong>real interview questions</strong>, <strong>real rejection reasons</strong>, and <strong>real-world explanations</strong> — not tutorials.
                </p>
                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 dark:text-green-400 mt-1 text-xl">✓</span>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      50 high-frequency interview questions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 dark:text-green-400 mt-1 text-xl">✓</span>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Structured, interview-ready answers
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 dark:text-green-400 mt-1 text-xl">✓</span>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Real-world examples + traps interviewers use
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
            )}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{service.price}</span>
                <span className="text-lg text-gray-500 dark:text-gray-400">one-time payment</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                  {hasPurchased ? (
                    // User has already purchased - show access button
                    service.slug === 'javascript-interview-mastery-kit' ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate(`/interview-kit/${service._id}`)}
                      >
                        Access Interview Kit
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/dashboard/documents')}
                      >
                        View in Dashboard
                      </Button>
                    )
                  ) : (
                    // User hasn't purchased - show pay button
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  navigate(`/premium/checkout?type=service&id=${service._id}&price=${service.price}`)
                }
              >
                Pay Now - ₹{service.price}
              </Button>
                  )}
              <Button variant="outline" size="lg" onClick={() => navigate('/premium')}>
                Back to Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Render content from service config if available */}
          {serviceConfig ? (
            <>
              {/* The Problem (first custom section if it exists) */}
              {serviceConfig.customSections && serviceConfig.customSections[0]?.title === 'The Problem (Pain Points)' && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.customSections[0].title}
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {renderFormattedText(serviceConfig.customSections[0].content as string)}
                  </div>
                </Card>
              )}

              {/* What is this? */}
              {serviceConfig.whatIsThis && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.whatIsThis.title}
                  </h2>
                  <div>
                    {serviceConfig.whatIsThis.paragraphs.map((paragraph, index) => (
                      <div key={index} className={index < serviceConfig.whatIsThis!.paragraphs.length - 1 ? 'mb-3' : ''}>
                        {renderFormattedText(paragraph)}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* What You Get */}
              {serviceConfig.whatYouGet && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.whatYouGet.title}
                  </h2>
                  <div className="space-y-6">
                    {serviceConfig.whatYouGet.items.map((item, index) => (
                      <div key={index} className="border-l-4 border-indigo-500 pl-5 py-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          {item.emoji && <span>{item.emoji}</span>}
                          <span>{item.title}</span>
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-2">
                            {item.description}
                          </p>
                        )}
                        {item.subItems && item.subItems.length > 0 && (
                          <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400 text-sm space-y-2 mt-2">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex}>{renderMarkdownText(subItem)}</li>
                            ))}
                          </ul>
                        )}
                        {item.additionalText && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                            {renderMarkdownText(item.additionalText)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Topics Covered */}
              {serviceConfig.topicsCovered && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.topicsCovered.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceConfig.topicsCovered.items.map((topic, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Who is this for? */}
              {serviceConfig.whoIsThisFor && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.whoIsThisFor.title}
                  </h2>
                  <ul className="space-y-2">
                    {serviceConfig.whoIsThisFor.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* How This Kit is Different */}
              {serviceConfig.howIsDifferent && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {serviceConfig.howIsDifferent.title}
                  </h2>
                  <div className="space-y-4">
                    {serviceConfig.howIsDifferent.notThese && serviceConfig.howIsDifferent.notThese.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {serviceConfig.howIsDifferent.notThese.map((item, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm font-medium"
                            >
                              ✗ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {serviceConfig.howIsDifferent.these && serviceConfig.howIsDifferent.these.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {serviceConfig.howIsDifferent.these.map((item, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm font-medium"
                            >
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {serviceConfig.howIsDifferent.closingText && (
                      <p className="text-gray-700 dark:text-gray-300 mt-4 italic">
                        {serviceConfig.howIsDifferent.closingText}
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Custom Sections (skip first one as it's already rendered above) */}
              {serviceConfig.customSections &&
                serviceConfig.customSections.slice(1).map((section, index) => (
                  <Card key={index + 1} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    {section.type === 'list' && Array.isArray(section.content) && (
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            {section.title !== 'Who This Is NOT For' ? (
                              <svg
                                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <span className="text-gray-700 dark:text-gray-300">{renderMarkdownText(item)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.type === 'text' && typeof section.content === 'string' && (
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {renderFormattedText(section.content)}
                      </div>
                    )}
                    {!section.type && Array.isArray(section.content) && (
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{renderMarkdownText(item)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
            </>
          ) : (
            /* Fallback to standard format if no config */
            service.deliverables && service.deliverables.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What You'll Get</h2>
              <ul className="space-y-3">
                {service.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </Card>
            )
          )}

          {/* How It Works */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Make Payment</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Complete the secure payment process to purchase this service.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get Access</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You'll receive access details soon after payment confirmation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Receive Service</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get your deliverables and start using the service to achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Purchase this service and get access to all premium features.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                hasPurchased
                  ? service.slug === 'javascript-interview-mastery-kit'
                    ? navigate(`/interview-kit/${service._id}`)
                    : navigate('/dashboard/documents')
                  : navigate(`/premium/checkout?type=service&id=${service._id}&price=${service.price}`)
              }
            >
              {hasPurchased
                ? service.slug === 'javascript-interview-mastery-kit'
                  ? 'Access Interview Kit'
                  : 'View in Dashboard'
                : `Pay Now - ₹${service.price}`}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
