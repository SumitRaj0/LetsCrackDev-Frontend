import { useParams, useNavigate, Link } from 'react-router-dom'
import { allResources } from '@/modules/resources/data/allResources'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'
import { useErrorHandler } from '@/contexts/ErrorContext'

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  const { handleError } = useErrorHandler()
  const resource = allResources.find(r => r.id === id)

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Resource Not Found</h1>
          <button
            onClick={() => navigate('/resources')}
            className="text-black dark:text-white hover:underline"
          >
            Back to Resources
          </button>
        </div>
      </div>
    )
  }

  const relatedResources = allResources
    .filter(r => r.categorySlug === resource.categorySlug && r.id !== resource.id)
    .slice(0, 3)

  const handleSave = () => {
    // Skip login, save directly and navigate to saved resources
    navigate('/dashboard/saved')
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        })
        showSuccess('Link shared successfully!')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showSuccess('Link copied to clipboard!')
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== 'AbortError') {
        handleError(error, {
          showToast: true,
          logError: true,
          context: { component: 'ResourceDetail', action: 'handleShare' },
        })
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/resources')}
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
            Back to Resources
          </Button>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary" size="md">
                {resource.category}
              </Badge>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {resource.rating}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">{resource.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{resource.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  Visit Resource
                </Button>
              </a>
              <Button variant="outline" onClick={() => navigate('/courses/1/view')} size="lg">
                View Course
              </Button>
              <Button variant="outline" onClick={handleSave} size="lg">
                Save
              </Button>
              <Button variant="outline" onClick={handleShare} size="lg">
                Share
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} size="lg">
                Go to Dashboard
              </Button>
            </div>

            {/* Additional Navigation Links */}
            <div className="mt-4 flex items-center gap-3 flex-wrap text-sm">
              <Button variant="ghost" onClick={() => navigate('/categories')} size="sm">
                Explore Categories
              </Button>
              <Button variant="ghost" onClick={() => navigate('/premium')} size="sm">
                View Premium Options
              </Button>
              <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                Login/Signup
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard/saved')} size="sm">
                Access Saved Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* What You'll Learn */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-3">
              {[
                'Master core concepts and fundamentals',
                'Build real-world projects',
                'Learn best practices',
                'Understand advanced techniques',
              ].map((item, index) => (
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
          </div>

          {/* About */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {resource.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This comprehensive resource provides in-depth coverage with practical examples, code
              snippets, and real-world use cases. The content is regularly updated to reflect the
              latest best practices.
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedResources.map(related => (
                  <Link key={related.id} to={`/resources/${related.id}`} className="block">
                    <Card className="p-4 hover-lift">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span>{related.rating}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
