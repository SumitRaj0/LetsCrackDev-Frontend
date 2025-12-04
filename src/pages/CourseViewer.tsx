import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Dummy course data
const courseData = {
  id: '1',
  title: 'Advanced React Patterns',
  instructor: 'Jane Smith',
  description:
    'Master advanced React patterns and best practices for building scalable applications.',
  modules: [
    {
      id: '1',
      title: 'Introduction to React Patterns',
      duration: '15:30',
      completed: true,
      videoUrl: 'https://example.com/video1',
    },
    {
      id: '2',
      title: 'Higher-Order Components',
      duration: '22:45',
      completed: true,
      videoUrl: 'https://example.com/video2',
    },
    {
      id: '3',
      title: 'Render Props Pattern',
      duration: '18:20',
      completed: false,
      videoUrl: 'https://example.com/video3',
    },
    {
      id: '4',
      title: 'Custom Hooks',
      duration: '25:10',
      completed: false,
      videoUrl: 'https://example.com/video4',
    },
  ],
}

export default function CourseViewer() {
  const navigate = useNavigate()
  const [currentModule, setCurrentModule] = useState(0)
  const [notes, setNotes] = useState('')
  const [comments, setComments] = useState([
    { id: '1', user: 'John Doe', text: 'Great explanation!', time: '2 hours ago' },
    { id: '2', user: 'Sarah Chen', text: 'This pattern is really useful.', time: '1 day ago' },
  ])
  const [newComment, setNewComment] = useState('')

  const module = courseData.modules[currentModule]
  const progress =
    (courseData.modules.filter(m => m.completed).length / courseData.modules.length) * 100

  const handleNextModule = () => {
    if (currentModule < courseData.modules.length - 1) {
      setCurrentModule(currentModule + 1)
    }
  }

  const handleMarkComplete = () => {
    // In real app, this would update the backend
    courseData.modules[currentModule].completed = true
    setCurrentModule(currentModule)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        { id: Date.now().toString(), user: 'You', text: newComment, time: 'Just now' },
        ...comments,
      ])
      setNewComment('')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/courses')}
              size="sm"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Return to My Courses
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg">Video Player</p>
                <p className="text-sm text-gray-400 mt-2">{module.title}</p>
              </div>
            </div>

            {/* Module Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">{module.title}</h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">{module.duration}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{courseData.description}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant={module.completed ? 'primary' : 'outline'}
                  onClick={handleMarkComplete}
                  size="md"
                >
                  {module.completed ? '✓ Completed' : 'Mark Complete'}
                </Button>
                {currentModule < courseData.modules.length - 1 && (
                  <Button variant="primary" onClick={handleNextModule} size="md">
                    Next Module →
                  </Button>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">My Notes</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
              />
              <Button variant="outline" onClick={() => setNotes('')} size="sm" className="mt-3">
                Clear Notes
              </Button>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Comments</h3>
              <div className="space-y-4 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-black dark:text-white text-sm">
                        {comment.user}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1"
                  rounded="default"
                />
                <Button variant="primary" onClick={handleAddComment} size="md">
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Course Modules
              </h3>
              <div className="space-y-2">
                {courseData.modules.map((mod, index) => (
                  <Button
                    key={mod.id}
                    variant={index === currentModule ? 'primary' : 'ghost'}
                    onClick={() => setCurrentModule(index)}
                    className="w-full text-left justify-start"
                    size="md"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {mod.completed && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="text-sm font-medium">{mod.title}</span>
                      </div>
                      <span className="text-xs opacity-70">{mod.duration}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
