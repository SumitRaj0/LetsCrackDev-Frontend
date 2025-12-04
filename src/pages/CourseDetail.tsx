import { useParams } from 'react-router-dom'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Course Details</h1>
        <p className="text-gray-600 dark:text-gray-400">Course ID: {id}</p>
      </div>
    </div>
  )
}
