import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { Button } from '@/components/ui/button'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { premiumCourses } from '@/data/premiumCourses'
import { premiumServices } from '@/data/premiumServices'

export default function Premium() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'courses' | 'services'>('courses')

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumCourses.map(course => (
              <PremiumCard key={course.id} item={course} type="course" />
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumServices.map(service => (
              <PremiumCard key={service.id} item={service} type="service" />
            ))}
          </div>
        )}
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
