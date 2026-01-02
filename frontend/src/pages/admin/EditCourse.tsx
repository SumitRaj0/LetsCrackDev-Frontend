import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { categories } from '@/modules/categories/data/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { createCourse, updateCourse, getCourseById } from '@/lib/api/courses.api'
import { useErrorHandler } from '@/contexts/ErrorContext'
import { useToast } from '@/contexts/ToastContext'

export default function AdminEditCourse() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  // Check if this is a new course: either no id param (route /admin/courses/new) or id is 'new'
  const isNew = !id || id === 'new' || location.pathname === '/admin/courses/new'
  const { handleError } = useErrorHandler()
  const { showSuccess } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: '',
    categorySlug: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    isPremium: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Fetch existing course for editing
  useEffect(() => {
    const fetchCourse = async () => {
      if (!isNew && id) {
        try {
          setIsFetching(true)
          const response = await getCourseById(id)
          if (response.success && response.data.course) {
            const course = response.data.course
            // Find category by matching the category name
            const category = categories.find(cat => 
              cat.name.toLowerCase() === course.category.toLowerCase()
            )
            
            setFormData({
              title: course.title,
              description: course.description,
              thumbnail: course.thumbnail || '',
              price: course.price.toString(),
              categorySlug: category?.slug || '',
              difficulty: course.difficulty || 'beginner',
              isPremium: course.isPremium || false,
            })
          }
        } catch (error) {
          handleError(error, {
            showToast: true,
            logError: true,
            context: { component: 'EditCourse', action: 'fetchCourse' },
          })
        } finally {
          setIsFetching(false)
        }
      }
    }

    fetchCourse()
  }, [id, isNew, handleError])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[EditCourse] Form submitted', { isNew, formData })
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }
      if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        throw new Error('Valid price is required')
      }
      if (!formData.categorySlug) {
        throw new Error('Please select a category')
      }

      // Find category name from slug
      const selectedCategory = categories.find(cat => cat.slug === formData.categorySlug)
      if (!selectedCategory) {
        throw new Error('Please select a valid category')
      }

      // Prepare data for API
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: selectedCategory.name, // Use category name, not slug
        price: Number(formData.price),
        difficulty: formData.difficulty,
        isPremium: formData.isPremium,
        lessons: [], // Can be added later
        ...(formData.thumbnail.trim() && { thumbnail: formData.thumbnail.trim() }),
      }

      console.log('[EditCourse] Prepared course data:', courseData)

      // Determine if this is a create or update operation
      const isCreateOperation = isNew || !id || id === 'new'
      
      if (isCreateOperation) {
        // Create new course
        console.log('[EditCourse] Creating new course...')
        const response = await createCourse(courseData)
        
        if (response && response.success) {
          console.log('[EditCourse] Course created successfully!')
          showSuccess('Course created successfully!')
          navigate('/admin/courses')
        } else {
          const errorMsg = response?.message || 'Failed to create course'
          throw new Error(errorMsg)
        }
      } else {
        // Update existing course
        if (!id || id === 'new') {
          throw new Error('Course ID is required for update')
        }
        
        console.log('[EditCourse] Updating course with id:', id)
        const response = await updateCourse(id, courseData)
        
        if (response && response.success) {
          console.log('[EditCourse] Course updated successfully!')
          showSuccess('Course updated successfully!')
          setTimeout(() => {
            navigate('/admin/courses')
          }, 500)
        } else {
          const errorMsg = response?.message || 'Failed to update course'
          throw new Error(errorMsg)
        }
      }
    } catch (error) {
      console.error('[EditCourse] Error in handleSubmit:', error)
      handleError(error, {
        showToast: true,
        logError: true,
        context: { component: 'EditCourse', action: 'handleSubmit' },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                {isNew ? 'Add New Course' : 'Edit Course'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isNew ? 'Create a new course for the platform' : 'Update course details'}
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/admin')} size="sm">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            {isFetching ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter course title"
                  rounded="default"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-y"
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail URL
                </label>
                <Input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  rounded="default"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  rounded="default"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="categorySlug"
                  value={formData.categorySlug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPremium"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isPremium" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Premium Course
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || isFetching} 
                  variant="primary" 
                  size="lg"
                >
                  {isLoading ? 'Saving...' : isNew ? 'Create Course' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/admin/courses')}
                  variant="outline"
                  size="lg"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}


